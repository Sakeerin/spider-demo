// Matching and contractor assignment types

import { ServiceType, UrgencyLevel } from './common';
import { Province } from './user';

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

export interface GenerateMatchDto {
  leadId: string;
  maxMatches?: number;
  excludeContractorIds?: string[];
}

export interface OverrideMatchDto {
  leadId: string;
  contractorIds: string[];
  reason?: string;
}

export interface ContractorResponseDto {
  leadAssignmentId: string;
  response: 'ACCEPTED' | 'DECLINED';
  declineReason?: string;
}

export interface ContractorAvailability {
  contractorId: string;
  isAvailable: boolean;
  currentJobs: number;
  maxJobs: number;
  utilizationRate: number;
  weeklyAvailability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>;
}

export interface ContractorWorkload {
  contractorId: string;
  activeJobs: number;
  maxJobs: number;
  utilizationRate: number;
  pendingMilestones: number;
  isAvailable: boolean;
}

// Scoring weights for the matching algorithm
export interface MatchingWeights {
  rating: number;
  experience: number;
  successRate: number;
  responseTime: number;
  workload: number;
  budget: number;
}

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  rating: 0.30,
  experience: 0.15,
  successRate: 0.25,
  responseTime: 0.10,
  workload: 0.15,
  budget: 0.05,
};
