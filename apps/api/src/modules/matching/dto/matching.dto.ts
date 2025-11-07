import { IsString, IsOptional, IsArray, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ServiceType, UrgencyLevel, Province } from '@prisma/client';

export class GenerateMatchDto {
  @IsString()
  leadId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  maxMatches?: number = 3;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeContractorIds?: string[];
}

export class OverrideMatchDto {
  @IsString()
  leadId: string;

  @IsArray()
  @IsString({ each: true })
  contractorIds: string[];

  @IsOptional()
  @IsString()
  reason?: string;
}

export class ContractorResponseDto {
  @IsString()
  leadAssignmentId: string;

  @IsEnum(['ACCEPTED', 'DECLINED'])
  response: 'ACCEPTED' | 'DECLINED';

  @IsOptional()
  @IsString()
  declineReason?: string;
}

export interface MatchCriteria {
  serviceType: ServiceType;
  province: Province;
  city: string;
  budgetMin?: number;
  budgetMax?: number;
  urgency: UrgencyLevel;
}

export interface ContractorMatch {
  contractorId: string;
  score: number;
  reasoning: string[];
  contractor: {
    id: string;
    businessName: string;
    averageRating: number;
    totalReviews: number;
    successRate: number;
    responseTime: number;
    experience: number;
    services: ServiceType[];
    serviceAreas: Province[];
  };
}

export interface MatchResult {
  leadId: string;
  matches: ContractorMatch[];
  totalCandidates: number;
  confidence: number;
  generatedAt: Date;
}
