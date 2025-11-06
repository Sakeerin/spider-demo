// Lead and job-related types and interfaces

import { ServiceType, UrgencyLevel, LeadStatus, JobStatus, MilestoneStatus, Location } from './common';
import { Province } from './user';

export interface ILead {
  id: string;
  customerId: string;
  serviceType: ServiceType;
  description: string;
  urgency: UrgencyLevel;
  status: LeadStatus;
  address: string;
  city: string;
  province: Province;
  postalCode?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredContactTime?: string;
  notes?: string;
  source?: string;
  campaign?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadAssignment {
  id: string;
  leadId: string;
  contractorId: string;
  assignedAt: Date;
  respondedAt?: Date;
  response?: string; // ACCEPTED, DECLINED, NO_RESPONSE
  declineReason?: string;
}

export interface ILeadWithAssignments extends ILead {
  leadAssignments: ILeadAssignment[];
}

// Lead creation and update DTOs
export interface CreateLeadDto {
  customerId: string;
  serviceType: ServiceType;
  description: string;
  urgency?: UrgencyLevel;
  address: string;
  city: string;
  province: Province;
  postalCode?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredContactTime?: string;
  notes?: string;
  source?: string;
  campaign?: string;
}

export interface UpdateLeadDto {
  serviceType?: ServiceType;
  description?: string;
  urgency?: UrgencyLevel;
  status?: LeadStatus;
  address?: string;
  city?: string;
  province?: Province;
  postalCode?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredContactTime?: string;
  notes?: string;
}

export interface AssignLeadDto {
  leadId: string;
  contractorIds: string[];
}

export interface RespondToLeadDto {
  leadAssignmentId: string;
  response: 'ACCEPTED' | 'DECLINED';
  declineReason?: string;
}

// Lead search and filtering
export interface LeadSearchFilters {
  status?: LeadStatus[];
  serviceType?: ServiceType[];
  urgency?: UrgencyLevel[];
  province?: Province[];
  budgetRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  source?: string[];
}

export interface LeadSearchResult {
  leads: ILeadWithAssignments[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}