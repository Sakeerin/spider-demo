import type {
  IJob,
  IMilestone,
  IJobWithDetails,
  CreateQuoteDto,
  ApproveQuoteDto,
  UpdateMilestoneDto,
  CompleteMilestoneDto,
} from '@spider/shared/types/job';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const jobsApi = {
  // Quote management
  async createQuote(token: string, data: CreateQuoteDto): Promise<IJobWithDetails> {
    const response = await fetch(`${API_URL}/jobs/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create quote');
    }

    return response.json();
  },

  async approveQuote(token: string, data: ApproveQuoteDto): Promise<IJobWithDetails> {
    const response = await fetch(`${API_URL}/jobs/quotes/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to approve quote');
    }

    return response.json();
  },

  // Milestone management
  async createMilestones(
    token: string,
    jobId: string,
    milestones: Array<{ title: string; description?: string; amount: number; dueDate: string }>
  ): Promise<IMilestone[]> {
    const response = await fetch(`${API_URL}/jobs/${jobId}/milestones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ milestones }),
    });

    if (!response.ok) {
      throw new Error('Failed to create milestones');
    }

    return response.json();
  },

  async updateMilestoneStatus(
    token: string,
    milestoneId: string,
    data: { status: string; notes?: string }
  ): Promise<IMilestone> {
    const response = await fetch(`${API_URL}/jobs/milestones/${milestoneId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update milestone status');
    }

    return response.json();
  },

  async completeMilestone(
    token: string,
    milestoneId: string,
    data: CompleteMilestoneDto
  ): Promise<IMilestone> {
    const response = await fetch(`${API_URL}/jobs/milestones/${milestoneId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to complete milestone');
    }

    return response.json();
  },

  // Job retrieval
  async getJobWithDetails(token: string, jobId: string): Promise<IJobWithDetails> {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job details');
    }

    return response.json();
  },

  async getMilestonesByJob(token: string, jobId: string): Promise<IMilestone[]> {
    const response = await fetch(`${API_URL}/jobs/${jobId}/milestones`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch milestones');
    }

    return response.json();
  },

  async getJobsByCustomer(token: string, customerId: string): Promise<IJobWithDetails[]> {
    const response = await fetch(`${API_URL}/jobs/customer/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer jobs');
    }

    return response.json();
  },

  async getJobsByContractor(token: string, contractorId: string): Promise<IJobWithDetails[]> {
    const response = await fetch(`${API_URL}/jobs/contractor/${contractorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contractor jobs');
    }

    return response.json();
  },
};
