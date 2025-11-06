// Random Match engine types and interfaces

import { ServiceType, UrgencyLevel, BudgetRange, GeoPoint } from './common';
import { Province } from './user';
import { IContractor } from './contractor';

export interface MatchCriteria {
  serviceType: ServiceType;
  location: GeoPoint;
  province: Province;
  budget: BudgetRange;
  urgency: UrgencyLevel;
  customerPreferences?: ContractorPreferences;
}

export interface ContractorPreferences {
  minRating?: number;
  minExperience?: number;
  preferredResponseTime?: number; // in minutes
  requiresVerification?: boolean;
}

export interface ContractorMatch {
  contractor: IContractor;
  score: number;
  confidence: number;
  reasoning: MatchReason[];
  distance?: number; // in kilometers
  estimatedResponseTime?: number; // in minutes
}

export interface MatchReason {
  factor: string;
  score: number;
  weight: number;
  description: string;
}

export interface MatchResult {
  contractors: ContractorMatch[];
  totalCandidates: number;
  confidence: number;
  reasoning: string[];
  criteria: MatchCriteria;
  generatedAt: Date;
}

export interface MatchRequest {
  leadId: string;
  criteria: MatchCriteria;
  maxResults?: number;
  excludeContractors?: string[];
}

export interface MatchResponse {
  success: boolean;
  result?: MatchResult;
  error?: string;
  requestId: string;
}

// Match scoring configuration
export interface MatchScoringWeights {
  serviceTypeMatch: number;
  locationProximity: number;
  budgetAlignment: number;
  availability: number;
  rating: number;
  experience: number;
  responseTime: number;
  workloadBalance: number;
}

export interface MatchConfiguration {
  weights: MatchScoringWeights;
  maxDistance: number; // in kilometers
  minScore: number;
  maxResults: number;
  urgencyMultipliers: Record<UrgencyLevel, number>;
}