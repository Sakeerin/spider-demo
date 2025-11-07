import {
  IContractor,
  IContractorWithDetails,
  IPortfolioItem,
  IAvailability,
  CreateContractorDto,
  UpdateContractorDto,
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  ContractorSearchResult,
} from '@spider/shared/types/contractor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const contractorsApi = {
  async create(token: string, data: Omit<CreateContractorDto, 'userId'>): Promise<IContractor> {
    const response = await fetch(`${API_URL}/contractors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create contractor profile');
    }

    return response.json();
  },

  async getMe(token: string): Promise<IContractorWithDetails> {
    const response = await fetch(`${API_URL}/contractors/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contractor profile');
    }

    return response.json();
  },

  async updateMe(token: string, data: UpdateContractorDto): Promise<IContractor> {
    const response = await fetch(`${API_URL}/contractors/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update contractor profile');
    }

    return response.json();
  },

  async getAll(filters?: any): Promise<ContractorSearchResult> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const url = params.toString() ? `${API_URL}/contractors?${params}` : `${API_URL}/contractors`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch contractors');
    }

    return response.json();
  },

  async getOne(id: string): Promise<IContractorWithDetails> {
    const response = await fetch(`${API_URL}/contractors/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch contractor');
    }

    return response.json();
  },

  async getPendingApprovals(token: string): Promise<IContractor[]> {
    const response = await fetch(`${API_URL}/contractors/pending-approvals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending approvals');
    }

    return response.json();
  },

  async approve(token: string, id: string, isApproved: boolean, verification: string): Promise<IContractor> {
    const response = await fetch(`${API_URL}/contractors/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isApproved, verification }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve contractor');
    }

    return response.json();
  },

  // Portfolio management
  async createPortfolioItem(token: string, data: CreatePortfolioItemDto): Promise<IPortfolioItem> {
    const response = await fetch(`${API_URL}/contractors/me/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create portfolio item');
    }

    return response.json();
  },

  async updatePortfolioItem(token: string, id: string, data: UpdatePortfolioItemDto): Promise<IPortfolioItem> {
    const response = await fetch(`${API_URL}/contractors/portfolio/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update portfolio item');
    }

    return response.json();
  },

  async deletePortfolioItem(token: string, id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/contractors/portfolio/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete portfolio item');
    }

    return response.json();
  },

  // Availability management
  async createAvailability(token: string, data: CreateAvailabilityDto): Promise<IAvailability> {
    const response = await fetch(`${API_URL}/contractors/me/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create availability');
    }

    return response.json();
  },

  async updateAvailability(token: string, id: string, data: UpdateAvailabilityDto): Promise<IAvailability> {
    const response = await fetch(`${API_URL}/contractors/availability/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update availability');
    }

    return response.json();
  },

  async deleteAvailability(token: string, id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/contractors/availability/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete availability');
    }

    return response.json();
  },
};
