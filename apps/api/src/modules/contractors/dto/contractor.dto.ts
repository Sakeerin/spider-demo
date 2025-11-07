import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsUrl,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ServiceType, Province, VerificationStatus } from '@prisma/client';

export class CreateContractorDto {
  @IsString()
  userId: string;

  @IsString()
  businessName: string;

  @IsArray()
  @IsEnum(ServiceType, { each: true })
  services: ServiceType[];

  @IsArray()
  @IsEnum(Province, { each: true })
  serviceAreas: Province[];

  @IsNumber()
  @Min(0)
  experience: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  businessLicense?: string;
}

export class UpdateContractorDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  services?: ServiceType[];

  @IsOptional()
  @IsArray()
  @IsEnum(Province, { each: true })
  serviceAreas?: Province[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  businessLicense?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxConcurrentJobs?: number;

  @IsOptional()
  @IsBoolean()
  prefersCatalogJobs?: boolean;
}

export class CreatePortfolioItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdatePortfolioItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class CreateAvailabilityDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ApproveContractorDto {
  @IsBoolean()
  isApproved: boolean;

  @IsEnum(VerificationStatus)
  verification: VerificationStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class ContractorSearchDto {
  @IsOptional()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  services?: ServiceType[];

  @IsOptional()
  @IsArray()
  @IsEnum(Province, { each: true })
  serviceAreas?: Province[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minExperience?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
