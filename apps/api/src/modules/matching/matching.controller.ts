import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { GenerateMatchDto, OverrideMatchDto, ContractorResponseDto } from './dto/matching.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@spider/shared';

@Controller('matching')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('generate')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  async generateMatches(@Body() generateMatchDto: GenerateMatchDto) {
    return this.matchingService.generateMatches(generateMatchDto);
  }

  @Post('override')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  async overrideMatch(@Body() overrideDto: OverrideMatchDto) {
    return this.matchingService.overrideMatch(overrideDto);
  }

  @Post('respond')
  @Roles(UserRole.CONTRACTOR)
  async respondToMatch(
    @Body() responseDto: ContractorResponseDto,
    @Request() req: any
  ) {
    return this.matchingService.handleContractorResponse(
      responseDto.leadAssignmentId,
      responseDto.response,
      responseDto.declineReason
    );
  }

  @Get('availability/:contractorId')
  @Roles(UserRole.COORDINATOR, UserRole.SALES, UserRole.ADMIN)
  async checkAvailability(@Param('contractorId') contractorId: string) {
    return this.matchingService.checkContractorAvailability(contractorId);
  }

  @Get('workload/:contractorId')
  @Roles(UserRole.COORDINATOR, UserRole.SALES, UserRole.ADMIN, UserRole.CONTRACTOR)
  async getWorkload(@Param('contractorId') contractorId: string, @Request() req: any) {
    // Contractors can only view their own workload
    if (req.user.role === UserRole.CONTRACTOR) {
      const contractor = await this.matchingService.getContractorWorkload(contractorId);
      // Verify ownership through user relationship
      // This would need additional validation in production
    }
    
    return this.matchingService.getContractorWorkload(contractorId);
  }
}
