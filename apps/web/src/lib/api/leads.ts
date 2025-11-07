import {
  ILead,
  ILeadWithAssignments,
  CreateLeadDto,
  UpdateLeadDto,
  AssignLeadDto,
  RespondToLeadDto,
  LeadSearchFilters,
  LeadSearchResult,
} from '@spider/shared/types/lead';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const leadsApi = {
  async createLead(token: string, data: CreateLeadDto): Promise<ILead> {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create lead');
    }

    return response.json();
  },

  async getLeads(
    token: string,
    filters?: LeadSearchFilters
  ): Promise<LeadSearchResult> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.status) params.append('status', filters.status.join(','));
      if (filters.serviceType)
        params.append('serviceType', filters.serviceType.join(','));
      if (filters.urgency) params.append('urgency', filters.urgency.join(','));
      if (filters.province)
        params.append('province', filters.province.join(','));
      if (filters.budgetRange?.min)
        params.append('budgetMin', filters.budgetRange.min.toString());
      if (filters.budgetRange?.max)
        params.append('budgetMax', filters.budgetRange.max.toString());
      if (filters.dateRange?.from)
        params.append('dateFrom', filters.dateRange.from.toISOString());
      if (filters.dateRange?.to)
        params.append('dateTo', filters.dateRange.to.toISOString());
      if (filters.source) params.append('source', filters.source.join(','));
    }

    const response = await fetch(`${API_URL}/leads?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }

    return response.json();
  },

  async getLeadQueue(token: string): Promise<ILeadWithAssignments[]> {
    const response = await fetch(`${API_URL}/leads/queue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lead queue');
    }

    return response.json();
  },

  async getMyLeads(token: string): Promise<ILeadWithAssignments[]> {
    const response = await fetch(`${API_URL}/leads/my-leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my leads');
    }

    return response.json();
  },

  async getLead(token: string, id: string): Promise<ILeadWithAssignments> {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lead');
    }

    return response.json();
  },

  async updateLead(
    token: string,
    id: string,
    data: UpdateLeadDto
  ): Promise<ILead> {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update lead');
    }

    return response.json();
  },

  async assignContractors(
    token: string,
    data: AssignLeadDto
  ): Promise<{ lead: ILeadWithAssignments; assignments: any[] }> {
    const response = await fetch(`${API_URL}/leads/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to assign contractors');
    }

    return response.json();
  },

  async respondToLead(token: string, data: RespondToLeadDto): Promise<any> {
    const response = await fetch(`${API_URL}/leads/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to respond to lead');
    }

    return response.json();
  },

  async deleteLead(token: string, id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete lead');
    }

    return response.json();
  },
};
