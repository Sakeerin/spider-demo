import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto, AssignLeadDto, RespondToLeadDto, LeadSearchDto } from './dto/lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@spider/shared';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createLeadDto: CreateLeadDto, @Request() req) {
    // Ensure the customerId matches the authenticated user or allow admins to create on behalf
    if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.COORDINATOR) {
      createLeadDto.customerId = req.user.userId;
    }
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COORDINATOR, UserRole.SALES, UserRole.ADMIN)
  findAll(@Query() searchDto: LeadSearchDto) {
    return this.leadsService.findAll(searchDto);
  }

  @Get('queue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  getLeadQueue() {
    return this.leadsService.getLeadQueue();
  }

  @Get('my-leads')
  @UseGuards(JwtAuthGuard)
  getMyLeads(@Request() req) {
    if (req.user.role === UserRole.CUSTOMER) {
      return this.leadsService.getLeadsByCustomer(req.user.userId);
    } else if (req.user.role === UserRole.CONTRACTOR) {
      // Get contractor ID from user
      return this.leadsService.getLeadsByContractor(req.user.contractorId);
    }
    return [];
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COORDINATOR, UserRole.SALES, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Post('assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  assignContractors(@Body() assignLeadDto: AssignLeadDto) {
    return this.leadsService.assignContractors(assignLeadDto);
  }

  @Post('respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONTRACTOR)
  respondToLead(@Body() respondDto: RespondToLeadDto) {
    return this.leadsService.respondToLead(respondDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }
}
