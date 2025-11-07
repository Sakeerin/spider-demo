import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuoteDto, ApproveQuoteDto, UpdateMilestoneStatusDto, CompleteMilestoneDto } from './dto/quote.dto';
import { JobStatus, MilestoneStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async createQuote(createQuoteDto: CreateQuoteDto, userId: string) {
    const { jobId, amount, document, milestones } = createQuoteDto;

    // Verify job exists and user has permission
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { contractor: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Verify total milestone amounts match quote amount
    const totalMilestoneAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
    if (Math.abs(totalMilestoneAmount - amount) > 0.01) {
      throw new BadRequestException('Milestone amounts must sum to quote amount');
    }

    // Update job with quote information
    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        quoteAmount: amount,
        quotedAt: new Date(),
        quoteDocument: document,
        totalAmount: amount,
        status: JobStatus.PENDING,
      },
      include: {
        milestones: true,
        contractor: true,
        customer: true,
        lead: true,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE_QUOTE',
        resource: 'jobs',
        resourceId: jobId,
        newValues: {
          quoteAmount: amount,
          document,
          milestonesCount: milestones.length,
        },
      },
    });

    return updatedJob;
  }

  async approveQuote(approveQuoteDto: ApproveQuoteDto, userId: string) {
    const { jobId } = approveQuoteDto;

    // Verify job exists and has a quote
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { lead: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (!job.quoteAmount) {
      throw new BadRequestException('Job does not have a quote');
    }

    // Update job status and create milestones
    const updatedJob = await this.prisma.$transaction(async (tx) => {
      // Update job
      const updated = await tx.job.update({
        where: { id: jobId },
        data: {
          quoteApprovedAt: new Date(),
          status: JobStatus.IN_PROGRESS,
        },
      });

      // Update lead status
      await tx.lead.update({
        where: { id: job.leadId },
        data: {
          status: 'APPROVED',
        },
      });

      return updated;
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'APPROVE_QUOTE',
        resource: 'jobs',
        resourceId: jobId,
        newValues: {
          quoteApprovedAt: updatedJob.quoteApprovedAt,
          status: updatedJob.status,
        },
      },
    });

    return this.getJobWithDetails(jobId);
  }

  async createMilestonesFromQuote(jobId: string, milestones: Array<{ title: string; description?: string; amount: number; dueDate: string }>) {
    // Verify job exists and quote is approved
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (!job.quoteApprovedAt) {
      throw new BadRequestException('Quote must be approved before creating milestones');
    }

    // Create milestones
    const createdMilestones = await this.prisma.$transaction(
      milestones.map((milestone) =>
        this.prisma.milestone.create({
          data: {
            jobId,
            title: milestone.title,
            description: milestone.description,
            amount: milestone.amount,
            dueDate: new Date(milestone.dueDate),
            status: MilestoneStatus.PENDING,
          },
        })
      )
    );

    return createdMilestones;
  }

  async updateMilestoneStatus(milestoneId: string, updateDto: UpdateMilestoneStatusDto, userId: string) {
    const { status, notes } = updateDto;

    // Verify milestone exists
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { job: true },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    // Validate status progression
    this.validateStatusProgression(milestone.status, status as MilestoneStatus);

    // Update milestone
    const updatedMilestone = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: status as MilestoneStatus,
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_MILESTONE_STATUS',
        resource: 'milestones',
        resourceId: milestoneId,
        oldValues: { status: milestone.status },
        newValues: { status, notes },
      },
    });

    // Check if all milestones are completed to update job status
    await this.checkAndUpdateJobStatus(milestone.jobId);

    return updatedMilestone;
  }

  async completeMilestone(milestoneId: string, completeDto: CompleteMilestoneDto, userId: string) {
    return this.updateMilestoneStatus(
      milestoneId,
      { status: 'COMPLETED', notes: completeDto.notes },
      userId
    );
  }

  async getMilestonesByJob(jobId: string) {
    return this.prisma.milestone.findMany({
      where: { jobId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getJobWithDetails(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        milestones: {
          orderBy: { dueDate: 'asc' },
        },
        documents: true,
        contractor: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        lead: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async getJobsByCustomer(customerId: string) {
    return this.prisma.job.findMany({
      where: { customerId },
      include: {
        milestones: true,
        contractor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getJobsByContractor(contractorId: string) {
    return this.prisma.job.findMany({
      where: { contractorId },
      include: {
        milestones: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private validateStatusProgression(currentStatus: MilestoneStatus, newStatus: MilestoneStatus) {
    const validTransitions: Record<MilestoneStatus, MilestoneStatus[]> = {
      PENDING: [MilestoneStatus.IN_PROGRESS],
      IN_PROGRESS: [MilestoneStatus.REVIEW, MilestoneStatus.PENDING],
      REVIEW: [MilestoneStatus.COMPLETED, MilestoneStatus.IN_PROGRESS],
      COMPLETED: [MilestoneStatus.PAID],
      PAID: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  private async checkAndUpdateJobStatus(jobId: string) {
    const milestones = await this.prisma.milestone.findMany({
      where: { jobId },
    });

    const allCompleted = milestones.every(
      (m) => m.status === MilestoneStatus.COMPLETED || m.status === MilestoneStatus.PAID
    );

    if (allCompleted && milestones.length > 0) {
      await this.prisma.job.update({
        where: { id: jobId },
        data: { status: JobStatus.COMPLETED },
      });
    }
  }
}
