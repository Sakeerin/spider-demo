import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  GenerateMatchDto,
  OverrideMatchDto,
  MatchCriteria,
  ContractorMatch,
  MatchResult,
} from './dto/matching.dto';
import { ServiceType, Province, UrgencyLevel } from '@prisma/client';

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate contractor matches for a lead using the Random Match algorithm
   */
  async generateMatches(generateMatchDto: GenerateMatchDto): Promise<MatchResult> {
    const { leadId, maxMatches = 3, excludeContractorIds = [] } = generateMatchDto;

    // Fetch the lead with customer details
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        customer: true,
        leadAssignments: true,
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    // Build match criteria from lead
    const criteria: MatchCriteria = {
      serviceType: lead.serviceType,
      province: lead.province,
      city: lead.city,
      budgetMin: lead.budgetMin || undefined,
      budgetMax: lead.budgetMax || undefined,
      urgency: lead.urgency,
    };

    // Get eligible contractors
    const eligibleContractors = await this.getEligibleContractors(criteria, excludeContractorIds);

    if (eligibleContractors.length === 0) {
      return {
        leadId,
        matches: [],
        totalCandidates: 0,
        confidence: 0,
        generatedAt: new Date(),
      };
    }

    // Score and rank contractors
    const scoredContractors = await this.scoreContractors(eligibleContractors, criteria);

    // Sort by score descending and take top matches
    const topMatches = scoredContractors
      .sort((a, b) => b.score - a.score)
      .slice(0, maxMatches);

    // Calculate confidence based on match quality
    const confidence = this.calculateConfidence(topMatches, scoredContractors.length);

    return {
      leadId,
      matches: topMatches,
      totalCandidates: eligibleContractors.length,
      confidence,
      generatedAt: new Date(),
    };
  }

  /**
   * Get contractors eligible for matching based on criteria
   */
  private async getEligibleContractors(
    criteria: MatchCriteria,
    excludeIds: string[] = []
  ) {
    const contractors = await this.prisma.contractor.findMany({
      where: {
        id: { notIn: excludeIds },
        isActive: true,
        isApproved: true,
        isAvailable: true,
        services: { has: criteria.serviceType },
        serviceAreas: { has: criteria.province },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        contractorJobs: {
          where: {
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Filter by workload capacity
    return contractors.filter((contractor) => {
      const currentJobs = contractor.contractorJobs.length;
      return currentJobs < contractor.maxConcurrentJobs;
    });
  }

  /**
   * Score contractors based on multiple factors
   */
  private async scoreContractors(
    contractors: any[],
    criteria: MatchCriteria
  ): Promise<ContractorMatch[]> {
    return contractors.map((contractor) => {
      const scores = {
        rating: this.scoreRating(contractor.averageRating, contractor.totalReviews),
        experience: this.scoreExperience(contractor.experience),
        successRate: this.scoreSuccessRate(contractor.successRate),
        responseTime: this.scoreResponseTime(contractor.responseTime),
        workload: this.scoreWorkload(
          contractor.contractorJobs.length,
          contractor.maxConcurrentJobs
        ),
        budget: this.scoreBudget(criteria.budgetMin, criteria.budgetMax),
      };

      // Weighted scoring
      const weights = {
        rating: 0.30,
        experience: 0.15,
        successRate: 0.25,
        responseTime: 0.10,
        workload: 0.15,
        budget: 0.05,
      };

      const totalScore =
        scores.rating * weights.rating +
        scores.experience * weights.experience +
        scores.successRate * weights.successRate +
        scores.responseTime * weights.responseTime +
        scores.workload * weights.workload +
        scores.budget * weights.budget;

      const reasoning = this.generateReasoning(scores, contractor);

      return {
        contractorId: contractor.id,
        score: Math.round(totalScore * 100) / 100,
        reasoning,
        contractor: {
          id: contractor.id,
          businessName: contractor.businessName,
          averageRating: contractor.averageRating,
          totalReviews: contractor.totalReviews,
          successRate: contractor.successRate,
          responseTime: contractor.responseTime,
          experience: contractor.experience,
          services: contractor.services,
          serviceAreas: contractor.serviceAreas,
        },
      };
    });
  }

  /**
   * Score based on rating and review count
   */
  private scoreRating(rating: number, reviewCount: number): number {
    if (reviewCount === 0) return 0.5; // Neutral score for new contractors
    
    // Normalize rating (0-5 scale to 0-1)
    const normalizedRating = rating / 5;
    
    // Apply confidence factor based on review count
    const confidenceFactor = Math.min(reviewCount / 20, 1); // Full confidence at 20+ reviews
    
    return normalizedRating * (0.7 + 0.3 * confidenceFactor);
  }

  /**
   * Score based on years of experience
   */
  private scoreExperience(years: number): number {
    // Diminishing returns after 10 years
    return Math.min(years / 10, 1);
  }

  /**
   * Score based on success rate
   */
  private scoreSuccessRate(rate: number): number {
    return rate / 100; // Convert percentage to 0-1 scale
  }

  /**
   * Score based on response time (lower is better)
   */
  private scoreResponseTime(minutes: number): number {
    if (minutes === 0) return 0.5; // No data yet
    
    // Excellent: < 60 min, Good: < 180 min, Fair: < 360 min
    if (minutes < 60) return 1.0;
    if (minutes < 180) return 0.8;
    if (minutes < 360) return 0.6;
    return 0.4;
  }

  /**
   * Score based on current workload
   */
  private scoreWorkload(currentJobs: number, maxJobs: number): number {
    const utilization = currentJobs / maxJobs;
    // Prefer contractors with some availability but not completely idle
    if (utilization < 0.3) return 0.8; // Too idle might indicate issues
    if (utilization < 0.7) return 1.0; // Sweet spot
    return 0.6; // Getting busy
  }

  /**
   * Score based on budget alignment (placeholder for future enhancement)
   */
  private scoreBudget(budgetMin?: number, budgetMax?: number): number {
    // For now, return neutral score
    // Future: Compare with contractor's typical project range
    return 0.5;
  }

  /**
   * Generate human-readable reasoning for the match
   */
  private generateReasoning(scores: any, contractor: any): string[] {
    const reasons: string[] = [];

    if (scores.rating > 0.8) {
      reasons.push(`Highly rated (${contractor.averageRating.toFixed(1)}/5.0 from ${contractor.totalReviews} reviews)`);
    } else if (scores.rating > 0.6) {
      reasons.push(`Good rating (${contractor.averageRating.toFixed(1)}/5.0)`);
    }

    if (scores.experience > 0.7) {
      reasons.push(`${contractor.experience}+ years of experience`);
    }

    if (scores.successRate > 0.8) {
      reasons.push(`${contractor.successRate}% success rate`);
    }

    if (scores.responseTime > 0.8) {
      reasons.push('Fast response time');
    }

    if (scores.workload > 0.9) {
      reasons.push('Optimal availability');
    } else if (scores.workload < 0.7) {
      reasons.push('Limited availability');
    }

    if (reasons.length === 0) {
      reasons.push('Meets basic requirements');
    }

    return reasons;
  }

  /**
   * Calculate overall confidence in the match results
   */
  private calculateConfidence(matches: ContractorMatch[], totalCandidates: number): number {
    if (matches.length === 0) return 0;

    // Base confidence on top match score and candidate pool size
    const topScore = matches[0].score;
    const poolFactor = Math.min(totalCandidates / 10, 1); // Full confidence with 10+ candidates
    
    return Math.round((topScore * 0.7 + poolFactor * 0.3) * 100);
  }

  /**
   * Override automatic matching with coordinator selection
   */
  async overrideMatch(overrideDto: OverrideMatchDto) {
    const { leadId, contractorIds, reason } = overrideDto;

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    // Verify all contractors exist and are eligible
    const contractors = await this.prisma.contractor.findMany({
      where: {
        id: { in: contractorIds },
        isActive: true,
        isApproved: true,
      },
    });

    if (contractors.length !== contractorIds.length) {
      throw new BadRequestException('One or more contractors are not available');
    }

    // Create lead assignments
    const assignments = await Promise.all(
      contractorIds.map((contractorId) =>
        this.prisma.leadAssignment.upsert({
          where: {
            leadId_contractorId: {
              leadId,
              contractorId,
            },
          },
          create: {
            leadId,
            contractorId,
          },
          update: {},
          include: {
            contractor: {
              select: {
                id: true,
                businessName: true,
                averageRating: true,
              },
            },
          },
        })
      )
    );

    // Update lead status
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: 'ASSIGNED' },
    });

    // TODO: Log the override action in audit log
    // TODO: Send notifications to assigned contractors

    return {
      lead: await this.prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          leadAssignments: {
            include: {
              contractor: true,
            },
          },
        },
      }),
      assignments,
      overrideReason: reason,
    };
  }

  /**
   * Handle contractor response to lead assignment
   */
  async handleContractorResponse(leadAssignmentId: string, response: 'ACCEPTED' | 'DECLINED', declineReason?: string) {
    const assignment = await this.prisma.leadAssignment.findUnique({
      where: { id: leadAssignmentId },
      include: {
        lead: true,
        contractor: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Lead assignment with ID ${leadAssignmentId} not found`);
    }

    if (assignment.response) {
      throw new BadRequestException('This lead assignment has already been responded to');
    }

    // Update the assignment
    const updatedAssignment = await this.prisma.leadAssignment.update({
      where: { id: leadAssignmentId },
      data: {
        response,
        declineReason: response === 'DECLINED' ? declineReason : null,
        respondedAt: new Date(),
      },
      include: {
        lead: true,
        contractor: true,
      },
    });

    // Handle acceptance
    if (response === 'ACCEPTED') {
      // TODO: Notify customer about acceptance
      // TODO: Update other assignments for this lead to NO_RESPONSE if not responded
    }

    // Handle decline - trigger reassignment
    if (response === 'DECLINED') {
      await this.handleDeclinedMatch(assignment.leadId, assignment.contractorId, declineReason);
    }

    return updatedAssignment;
  }

  /**
   * Handle declined match and trigger reassignment
   */
  private async handleDeclinedMatch(leadId: string, declinedContractorId: string, reason?: string) {
    // Get all assignments for this lead
    const allAssignments = await this.prisma.leadAssignment.findMany({
      where: { leadId },
    });

    // Check if all contractors have declined
    const allDeclined = allAssignments.every(
      (a) => a.response === 'DECLINED' || a.id === declinedContractorId
    );

    if (allDeclined) {
      // All contractors declined - need to find new matches
      const excludeIds = allAssignments.map((a) => a.contractorId);
      
      const newMatches = await this.generateMatches({
        leadId,
        maxMatches: 3,
        excludeContractorIds: excludeIds,
      });

      if (newMatches.matches.length > 0) {
        // Auto-assign new matches
        const newContractorIds = newMatches.matches.map((m) => m.contractorId);
        
        await Promise.all(
          newContractorIds.map((contractorId) =>
            this.prisma.leadAssignment.create({
              data: {
                leadId,
                contractorId,
              },
            })
          )
        );

        // TODO: Send notifications to new contractors
        // TODO: Notify coordinator about reassignment
      } else {
        // No more matches available - notify coordinator
        // TODO: Create notification for coordinator to manually handle
        await this.prisma.lead.update({
          where: { id: leadId },
          data: { status: 'PENDING' },
        });
      }
    }

    // TODO: Log decline reason for analytics
  }

  /**
   * Check contractor availability for a specific time period
   */
  async checkContractorAvailability(contractorId: string, startDate?: Date, endDate?: Date) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        contractorJobs: {
          where: {
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
        },
        availability: {
          where: { isActive: true },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException(`Contractor with ID ${contractorId} not found`);
    }

    const currentJobs = contractor.contractorJobs.length;
    const hasCapacity = currentJobs < contractor.maxConcurrentJobs;

    return {
      contractorId,
      isAvailable: contractor.isAvailable && hasCapacity,
      currentJobs,
      maxJobs: contractor.maxConcurrentJobs,
      utilizationRate: (currentJobs / contractor.maxConcurrentJobs) * 100,
      weeklyAvailability: contractor.availability,
    };
  }

  /**
   * Get workload statistics for contractors
   */
  async getContractorWorkload(contractorId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        contractorJobs: {
          where: {
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
          include: {
            milestones: true,
          },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException(`Contractor with ID ${contractorId} not found`);
    }

    const activeJobs = contractor.contractorJobs.length;
    const pendingMilestones = contractor.contractorJobs.reduce(
      (sum, job) => sum + job.milestones.filter((m) => m.status === 'PENDING').length,
      0
    );

    return {
      contractorId,
      activeJobs,
      maxJobs: contractor.maxConcurrentJobs,
      utilizationRate: (activeJobs / contractor.maxConcurrentJobs) * 100,
      pendingMilestones,
      isAvailable: contractor.isAvailable && activeJobs < contractor.maxConcurrentJobs,
    };
  }
}
