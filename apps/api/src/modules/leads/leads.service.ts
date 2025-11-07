import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto, AssignLeadDto, RespondToLeadDto, LeadSearchDto } from './dto/lead.dto';
import { LeadStatus, Prisma } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        ...createLeadDto,
        urgency: createLeadDto.urgency || 'MEDIUM',
        status: 'PENDING',
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    // TODO: Send confirmation notification (email/SMS/LINE)
    // This will be implemented in the notification system task

    return lead;
  }

  async findAll(searchDto: LeadSearchDto) {
    const {
      status,
      serviceType,
      urgency,
      province,
      budgetMin,
      budgetMax,
      dateFrom,
      dateTo,
      source,
      page = 1,
      limit = 20,
    } = searchDto;

    const where: Prisma.LeadWhereInput = {};

    if (status && status.length > 0) {
      where.status = { in: status };
    }

    if (serviceType && serviceType.length > 0) {
      where.serviceType = { in: serviceType };
    }

    if (urgency && urgency.length > 0) {
      where.urgency = { in: urgency };
    }

    if (province && province.length > 0) {
      where.province = { in: province };
    }

    if (budgetMin !== undefined || budgetMax !== undefined) {
      where.AND = [];
      if (budgetMin !== undefined) {
        where.AND.push({
          OR: [
            { budgetMin: { gte: budgetMin } },
            { budgetMax: { gte: budgetMin } },
          ],
        });
      }
      if (budgetMax !== undefined) {
        where.AND.push({
          OR: [
            { budgetMin: { lte: budgetMax } },
            { budgetMax: { lte: budgetMax } },
          ],
        });
      }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    if (source && source.length > 0) {
      where.source = { in: source };
    }

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          leadAssignments: {
            include: {
              contractor: {
                select: {
                  id: true,
                  businessName: true,
                  averageRating: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        leadAssignments: {
          include: {
            contractor: {
              select: {
                id: true,
                businessName: true,
                averageRating: true,
                services: true,
              },
            },
          },
        },
        jobs: {
          select: {
            id: true,
            status: true,
            title: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        leadAssignments: {
          include: {
            contractor: {
              select: {
                id: true,
                businessName: true,
                averageRating: true,
              },
            },
          },
        },
      },
    });
  }

  async assignContractors(assignLeadDto: AssignLeadDto) {
    const { leadId, contractorIds } = assignLeadDto;

    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    // Verify all contractors exist and are active
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
        })
      )
    );

    // Update lead status to ASSIGNED
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: 'ASSIGNED' },
    });

    // TODO: Send notifications to assigned contractors
    // This will be implemented in the notification system task

    return {
      lead: await this.findOne(leadId),
      assignments,
    };
  }

  async respondToLead(respondDto: RespondToLeadDto) {
    const { leadAssignmentId, response, declineReason } = respondDto;

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

    const updatedAssignment = await this.prisma.leadAssignment.update({
      where: { id: leadAssignmentId },
      data: {
        response,
        declineReason: response === 'DECLINED' ? declineReason : null,
        respondedAt: new Date(),
      },
    });

    // TODO: Send notification to customer about contractor response
    // TODO: If declined, trigger reassignment logic
    // These will be implemented in the notification and matching system tasks

    return updatedAssignment;
  }

  async getLeadsByCustomer(customerId: string) {
    return this.prisma.lead.findMany({
      where: { customerId },
      include: {
        leadAssignments: {
          include: {
            contractor: {
              select: {
                id: true,
                businessName: true,
                averageRating: true,
              },
            },
          },
        },
        jobs: {
          select: {
            id: true,
            status: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLeadsByContractor(contractorId: string) {
    const assignments = await this.prisma.leadAssignment.findMany({
      where: { contractorId },
      include: {
        lead: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    return assignments.map((assignment) => ({
      ...assignment.lead,
      assignment: {
        id: assignment.id,
        assignedAt: assignment.assignedAt,
        respondedAt: assignment.respondedAt,
        response: assignment.response,
        declineReason: assignment.declineReason,
      },
    }));
  }

  async getLeadQueue() {
    // Get leads that are pending or need reassignment
    return this.prisma.lead.findMany({
      where: {
        OR: [
          { status: 'PENDING' },
          {
            status: 'ASSIGNED',
            leadAssignments: {
              some: {
                response: 'DECLINED',
              },
            },
          },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        leadAssignments: {
          include: {
            contractor: {
              select: {
                id: true,
                businessName: true,
                averageRating: true,
              },
            },
          },
        },
      },
      orderBy: [
        { urgency: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async delete(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return this.prisma.lead.delete({ where: { id } });
  }
}
