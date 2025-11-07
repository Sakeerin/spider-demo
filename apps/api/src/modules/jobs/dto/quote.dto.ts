import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMilestoneDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  dueDate: string;
}

export class CreateQuoteDto {
  @IsString()
  jobId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  document?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMilestoneDto)
  milestones: CreateMilestoneDto[];
}

export class ApproveQuoteDto {
  @IsString()
  jobId: string;
}

export class UpdateMilestoneStatusDto {
  @IsString()
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'PAID';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteMilestoneDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}
