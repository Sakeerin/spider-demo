import { IsString, IsEnum, IsOptional, IsNumber, Min, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType, UrgencyLevel, LeadStatus } from '@prisma/client';
import { Province } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(UrgencyLevel)
  @IsOptional()
  urgency?: UrgencyLevel;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(Province)
  province: Province;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @IsString()
  @IsOptional()
  preferredContactTime?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  campaign?: string;
}

export class UpdateLeadDto {
  @IsEnum(ServiceType)
  @IsOptional()
  serviceType?: ServiceType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(UrgencyLevel)
  @IsOptional()
  urgency?: UrgencyLevel;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsEnum(Province)
  @IsOptional()
  province?: Province;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @IsString()
  @IsOptional()
  preferredContactTime?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AssignLeadDto {
  @IsString()
  @IsNotEmpty()
  leadId: string;

  @IsArray()
  @IsString({ each: true })
  contractorIds: string[];
}

export class RespondToLeadDto {
  @IsString()
  @IsNotEmpty()
  leadAssignmentId: string;

  @IsEnum(['ACCEPTED', 'DECLINED'])
  response: 'ACCEPTED' | 'DECLINED';

  @IsString()
  @IsOptional()
  declineReason?: string;
}

export class LeadSearchDto {
  @IsArray()
  @IsEnum(LeadStatus, { each: true })
  @IsOptional()
  status?: LeadStatus[];

  @IsArray()
  @IsEnum(ServiceType, { each: true })
  @IsOptional()
  serviceType?: ServiceType[];

  @IsArray()
  @IsEnum(UrgencyLevel, { each: true })
  @IsOptional()
  urgency?: UrgencyLevel[];

  @IsArray()
  @IsEnum(Province, { each: true })
  @IsOptional()
  province?: Province[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budgetMax?: number;

  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  source?: string[];

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
