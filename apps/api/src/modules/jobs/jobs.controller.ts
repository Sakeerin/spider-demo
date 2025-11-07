import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateQuoteDto, ApproveQuoteDto, UpdateMilestoneStatusDto, CompleteMilestoneDto } from './dto/quote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@spider/shared';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('quotes')
  @Roles(UserRole.SALES, UserRole.CONTRACTOR, UserRole.ADMIN)
  async createQuote(@Body() createQuoteDto: CreateQuoteDto, @Request() req) {
    return this.jobsService.createQuote(createQuoteDto, req.user.userId);
  }

  @Post('quotes/approve')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async approveQuote(@Body() approveQuoteDto: ApproveQuoteDto, @Request() req) {
    return this.jobsService.approveQuote(approveQuoteDto, req.user.userId);
  }

  @Post(':jobId/milestones')
  @Roles(UserRole.SALES, UserRole.CONTRACTOR, UserRole.ADMIN)
  async createMilestones(
    @Param('jobId') jobId: string,
    @Body() body: { milestones: Array<{ title: string; description?: string; amount: number; dueDate: string }> },
    @Request() req
  ) {
    return this.jobsService.createMilestonesFromQuote(jobId, body.milestones);
  }

  @Patch('milestones/:milestoneId/status')
  @Roles(UserRole.CONTRACTOR, UserRole.SALES, UserRole.ADMIN)
  async updateMilestoneStatus(
    @Param('milestoneId') milestoneId: string,
    @Body() updateDto: UpdateMilestoneStatusDto,
    @Request() req
  ) {
    return this.jobsService.updateMilestoneStatus(milestoneId, updateDto, req.user.userId);
  }

  @Post('milestones/:milestoneId/complete')
  @Roles(UserRole.CONTRACTOR, UserRole.ADMIN)
  async completeMilestone(
    @Param('milestoneId') milestoneId: string,
    @Body() completeDto: CompleteMilestoneDto,
    @Request() req
  ) {
    return this.jobsService.completeMilestone(milestoneId, completeDto, req.user.userId);
  }

  @Get(':jobId')
  async getJobWithDetails(@Param('jobId') jobId: string) {
    return this.jobsService.getJobWithDetails(jobId);
  }

  @Get(':jobId/milestones')
  async getMilestonesByJob(@Param('jobId') jobId: string) {
    return this.jobsService.getMilestonesByJob(jobId);
  }

  @Get('customer/:customerId')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SALES)
  async getJobsByCustomer(@Param('customerId') customerId: string) {
    return this.jobsService.getJobsByCustomer(customerId);
  }

  @Get('contractor/:contractorId')
  @Roles(UserRole.CONTRACTOR, UserRole.ADMIN, UserRole.COORDINATOR)
  async getJobsByContractor(@Param('contractorId') contractorId: string) {
    return this.jobsService.getJobsByContractor(contractorId);
  }
}
