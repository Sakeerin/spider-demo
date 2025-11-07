'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { usersApi } from '@/lib/api/users';
import { UserProfileForm } from '@/components/profile/user-profile-form';
import { UserProfileSettings } from '@/components/profile/user-profile-settings';
import { UpdateUserDto, UpdateUserProfileDto } from '@spider/shared/types/user';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setToken(accessToken);
    if (accessToken) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const data = await usersApi.getMe(token!);
      setUserData(data);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateUserDto) => {
    await usersApi.updateMe(token!, data);
    await loadUserData();
  };

  const handleUpdateSettings = async (data: UpdateUserProfileDto) => {
    await usersApi.updateProfile(token!, data);
    await loadUserData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 border-b-2 font-medium ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-4 border-b-2 font-medium ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {activeTab === 'profile' && (
          <UserProfileForm user={userData} onSubmit={handleUpdateProfile} />
        )}

        {activeTab === 'settings' && (
          <UserProfileSettings
            profile={userData.profile}
            onSubmit={handleUpdateSettings}
          />
        )}
      </div>
    </div>
  );
}
