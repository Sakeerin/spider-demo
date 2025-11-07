const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface MatchCriteria {
  serviceType: string;
  province: string;
  city: string;
  budgetMin?: number;
  budgetMax?: number;
  urgency: string;
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
    services: string[];
    serviceAreas: string[];
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

export const matchingApi = {
  /**
   * Generate contractor matches for a lead
   */
  async generateMatches(
    token: string,
    data: GenerateMatchDto
  ): Promise<MatchResult> {
    const response = await fetch(`${API_URL}/matching/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate matches');
    }

    return response.json();
  },

  /**
   * Override automatic matching with manual selection
   */
  async overrideMatch(token: string, data: OverrideMatchDto) {
    const response = await fetch(`${API_URL}/matching/override`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to override match');
    }

    return response.json();
  },

  /**
   * Contractor responds to a lead assignment
   */
  async respondToMatch(token: string, data: ContractorResponseDto) {
    const response = await fetch(`${API_URL}/matching/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to respond to match');
    }

    return response.json();
  },

  /**
   * Check contractor availability
   */
  async checkAvailability(
    token: string,
    contractorId: string
  ): Promise<ContractorAvailability> {
    const response = await fetch(
      `${API_URL}/matching/availability/${contractorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to check availability');
    }

    return response.json();
  },

  /**
   * Get contractor workload statistics
   */
  async getWorkload(
    token: string,
    contractorId: string
  ): Promise<ContractorWorkload> {
    const response = await fetch(
      `${API_URL}/matching/workload/${contractorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get workload');
    }

    return response.json();
  },
};
