import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateContractorDto,
  UpdateContractorDto,
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  ApproveContractorDto,
  ContractorSearchDto,
} from './dto/contractor.dto';
import { UserRole, VerificationStatus } from '@prisma/client';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}

  async create(createContractorDto: CreateContractorDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createContractorDto.userId },
      include: { contractor: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.contractor) {
      throw new ConflictException('User already has a contractor profile');
    }

    const contractor = await this.prisma.contractor.create({
      data: createContractorDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        portfolio: true,
        availability: true,
      },
    });

    // Update user role to CONTRACTOR if not already
    if (user.role !== UserRole.CONTRACTOR) {
      await this.prisma.user.update({
        where: { id: createContractorDto.userId },
        data: { role: UserRole.CONTRACTOR },
      });
    }

    return contractor;
  }

  async findAll(searchDto?: ContractorSearchDto) {
    const page = searchDto?.page || 1;
    const limit = searchDto?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (searchDto?.services && searchDto.services.length > 0) {
      where.services = { hasSome: searchDto.services };
    }

    if (searchDto?.serviceAreas && searchDto.serviceAreas.length > 0) {
      where.serviceAreas = { hasSome: searchDto.serviceAreas };
    }

    if (searchDto?.minRating !== undefined) {
      where.averageRating = { gte: searchDto.minRating };
    }

    if (searchDto?.minExperience !== undefined) {
      where.experience = { gte: searchDto.minExperience };
    }

    if (searchDto?.isAvailable !== undefined) {
      where.isAvailable = searchDto.isAvailable;
    }

    const [contractors, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatar: true,
            },
          },
          portfolio: {
            where: { isPublic: true },
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
        skip,
        take: limit,
        orderBy: [
          { averageRating: 'desc' },
          { totalReviews: 'desc' },
        ],
      }),
      this.prisma.contractor.count({ where }),
    ]);

    return {
      contractors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          },
        },
        portfolio: {
          orderBy: { createdAt: 'desc' },
        },
        availability: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return contractor;
  }

  async findByUserId(userId: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          },
        },
        portfolio: {
          orderBy: { createdAt: 'desc' },
        },
        availability: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor profile not found');
    }

    return contractor;
  }

  async update(id: string, updateContractorDto: UpdateContractorDto, userId?: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    // Check if user is updating their own profile
    if (userId && contractor.userId !== userId) {
      throw new ForbiddenException('You can only update your own contractor profile');
    }

    const updated = await this.prisma.contractor.update({
      where: { id },
      data: updateContractorDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          },
        },
        portfolio: true,
        availability: true,
      },
    });

    return updated;
  }

  async approve(id: string, approveDto: ApproveContractorDto) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    const updated = await this.prisma.contractor.update({
      where: { id },
      data: {
        isApproved: approveDto.isApproved,
        verification: approveDto.verification,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // TODO: Send notification to contractor about approval/rejection

    return updated;
  }

  async getPendingApprovals() {
    return this.prisma.contractor.findMany({
      where: {
        verification: VerificationStatus.PENDING,
        isApproved: false,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        portfolio: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async remove(id: string) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    await this.prisma.contractor.delete({
      where: { id },
    });

    return { message: 'Contractor profile deleted successfully' };
  }

  // Portfolio management
  async createPortfolioItem(contractorId: string, createDto: CreatePortfolioItemDto) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return this.prisma.portfolioItem.create({
      data: {
        ...createDto,
        contractorId,
        completedAt: createDto.completedAt ? new Date(createDto.completedAt) : undefined,
      },
    });
  }

  async updatePortfolioItem(id: string, updateDto: UpdatePortfolioItemDto, contractorId?: string) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (contractorId && item.contractorId !== contractorId) {
      throw new ForbiddenException('You can only update your own portfolio items');
    }

    return this.prisma.portfolioItem.update({
      where: { id },
      data: {
        ...updateDto,
        completedAt: updateDto.completedAt ? new Date(updateDto.completedAt) : undefined,
      },
    });
  }

  async deletePortfolioItem(id: string, contractorId?: string) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (contractorId && item.contractorId !== contractorId) {
      throw new ForbiddenException('You can only delete your own portfolio items');
    }

    await this.prisma.portfolioItem.delete({
      where: { id },
    });

    return { message: 'Portfolio item deleted successfully' };
  }

  // Availability management
  async createAvailability(contractorId: string, createDto: CreateAvailabilityDto) {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return this.prisma.availability.create({
      data: {
        ...createDto,
        contractorId,
      },
    });
  }

  async updateAvailability(id: string, updateDto: UpdateAvailabilityDto, contractorId?: string) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    if (contractorId && availability.contractorId !== contractorId) {
      throw new ForbiddenException('You can only update your own availability');
    }

    return this.prisma.availability.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteAvailability(id: string, contractorId?: string) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    if (contractorId && availability.contractorId !== contractorId) {
      throw new ForbiddenException('You can only delete your own availability');
    }

    await this.prisma.availability.delete({
      where: { id },
    });

    return { message: 'Availability deleted successfully' };
  }
}
