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
} from '@nestjs/common';
import { ContractorsService } from './contractors.service';
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
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@spider/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('contractors')
@UseGuards(RolesGuard)
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER, UserRole.CONTRACTOR)
  create(@Body() createContractorDto: CreateContractorDto, @CurrentUser() user: any) {
    // Ensure user can only create their own contractor profile
    createContractorDto.userId = user.sub;
    return this.contractorsService.create(createContractorDto);
  }

  @Get()
  @Public()
  findAll(@Query() searchDto: ContractorSearchDto) {
    return this.contractorsService.findAll(searchDto);
  }

  @Get('pending-approvals')
  @Roles(UserRole.ADMIN)
  getPendingApprovals() {
    return this.contractorsService.getPendingApprovals();
  }

  @Get('me')
  @Roles(UserRole.CONTRACTOR)
  getMyProfile(@CurrentUser() user: any) {
    return this.contractorsService.findByUserId(user.sub);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.contractorsService.findOne(id);
  }

  @Patch('me')
  @Roles(UserRole.CONTRACTOR)
  updateMe(@CurrentUser() user: any, @Body() updateContractorDto: UpdateContractorDto) {
    return this.contractorsService.findByUserId(user.sub).then(contractor =>
      this.contractorsService.update(contractor.id, updateContractorDto, user.sub),
    );
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateContractorDto: UpdateContractorDto) {
    return this.contractorsService.update(id, updateContractorDto);
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  approve(@Param('id') id: string, @Body() approveDto: ApproveContractorDto) {
    return this.contractorsService.approve(id, approveDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.contractorsService.remove(id);
  }

  // Portfolio endpoints
  @Post('me/portfolio')
  @Roles(UserRole.CONTRACTOR)
  createPortfolioItem(
    @CurrentUser() user: any,
    @Body() createDto: CreatePortfolioItemDto,
  ) {
    return this.contractorsService.findByUserId(user.sub).then(contractor =>
      this.contractorsService.createPortfolioItem(contractor.id, createDto),
    );
  }

  @Patch('portfolio/:id')
  @Roles(UserRole.CONTRACTOR)
  updatePortfolioItem(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdatePortfolioItemDto,
  ) {
    return this.contractorsService.findByUserId(user.sub).then(contractor =>
      this.contractorsService.updatePortfolioItem(id, updateDto, contractor.id),
    );
  }

  @Delete('portfolio/:id')
  @Roles(UserRole.CONTRACTOR)
  deletePortfolioItem(@CurrentUser() user: any, @Param('id') id: string) {
    return this.contractorsService.findByUserId(user.sub).then(contractor =>
      this.contractorsService.deletePortfolioItem(id, contractor.id),
    );
  }

  // Availability endpoints
  @Post('me/availability')
  @Roles(UserRole.CONTRACTOR)
  createAvailability(
    @CurrentUser() user: any,
    @Body() createDto: CreateAvailabilityDto,
  ) {
    return this.contractorsService.findByUserId(user.sub).then(contractor =>
      this.contractorsService.createAvailability(contractor.id, createDto),
    );
  }

  @Patch('availability/:id')
  @Roles(UserRole.CONTRACTOR)
  updateAvailability(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateAvailabilityDto,
  ) {
    return this.contractorsService.findByUserId(user.sub).then(contractor =>
      this.contractorsService.updateAvailability(id, updateDto, contractor.id),
    );
  }

  @Delete('availability/:id')
  @Roles(UserRole.CONTRACTOR)
  deleteAvailability(@CurrentUser() user: any, @Param('id') id: string) {
    return this.contractorsService.findByUserId(user.sub).then(contractor =>
      this.contractorsService.deleteAvailability(id, contractor.id),
    );
  }
}
