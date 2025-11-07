import {
  IUser,
  IUserProfile,
  UpdateUserDto,
  UpdateUserProfileDto,
} from '@spider/shared/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const usersApi = {
  async getMe(token: string): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  async updateMe(token: string, data: UpdateUserDto): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    return response.json();
  },

  async updateProfile(
    token: string,
    data: UpdateUserProfileDto
  ): Promise<IUserProfile> {
    const response = await fetch(`${API_URL}/users/me/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile settings');
    }

    return response.json();
  },

  async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/me/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Failed to change password');
    }

    return response.json();
  },

  async getUser(token: string, id: string): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },

  async getAllUsers(token: string, role?: string): Promise<IUser[]> {
    const url = role ? `${API_URL}/users?role=${role}` : `${API_URL}/users`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async updateUserRole(
    token: string,
    userId: string,
    role: string
  ): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return response.json();
  },

  async deleteUser(
    token: string,
    userId: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.json();
  },
};
