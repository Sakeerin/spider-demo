// Matching algorithm types and interfaces

import { ServiceType } from './common';
import { Province } from './user';

export interface MatchCriteria {
  serviceType: ServiceType;
  location: {
    province: Province;
    latitude?: number;
    longitude?: number;
  };
  budget?: {
    min?: number;
    max?: number;
  };
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  customerPreferences?: {
    minRating?: number;
    minExperience?: number;
  };
}

export interface ContractorMatch {
  contractorId: string;
  score: number;
  matchReasons: string[];
  contractor: any; // Full contractor details
}

export interface MatchResult {
  contractors: ContractorMatch[];
  confidence: number;
  reasoning: string[];
}
