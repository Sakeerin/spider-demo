// Job and milestone-related types and interfaces

import { JobStatus, MilestoneStatus } from './common';

export interface IJob {
  id: string;
  leadId: string;
  contractorId: string;
  customerId: string;
  status: JobStatus;
  title: string;
  description: string;
  totalAmount?: number;
  startDate?: Date;
  endDate?: Date;
  quoteAmount?: number;
  quotedAt?: Date;
  quoteApprovedAt?: Date;
  quoteDocument?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMilestone {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  amount: number;
  dueDate: Date;
  status: MilestoneStatus;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  id: string;
  jobId: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobWithDetails extends IJob {
  milestones: IMilestone[];
  documents: IDocument[];
  contractor?: {
    id: string;
    businessName: string;
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
  customer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  lead?: any;
}

// Job creation and update DTOs
export interface CreateJobDto {
  leadId: string;
  contractorId: string;
  customerId: string;
  title: string;
  description: string;
  totalAmount?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateJobDto {
  status?: JobStatus;
  title?: string;
  description?: string;
  totalAmount?: number;
  startDate?: Date;
  endDate?: Date;
  quoteAmount?: number;
  quoteDocument?: string;
}

export interface CreateQuoteDto {
  jobId: string;
  amount: number;
  document?: string;
  milestones: CreateMilestoneDto[];
}

export interface ApproveQuoteDto {
  jobId: string;
}

// Milestone DTOs
export interface CreateMilestoneDto {
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
}

export interface UpdateMilestoneDto {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: Date;
  status?: MilestoneStatus;
}

export interface CompleteMilestoneDto {
  milestoneId: string;
  notes?: string;
  documents?: string[];
}

// Document DTOs
export interface UploadDocumentDto {
  jobId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
}

// Job search and filtering
export interface JobSearchFilters {
  status?: JobStatus[];
  contractorId?: string;
  customerId?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export interface JobSearchResult {
  jobs: IJobWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Job statistics
export interface JobStatistics {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  averageJobValue: number;
  averageCompletionTime: number;
}

export interface MilestoneStatistics {
  totalMilestones: number;
  pendingMilestones: number;
  inProgressMilestones: number;
  completedMilestones: number;
  overdueMilestones: number;
  totalValue: number;
  paidValue: number;
}