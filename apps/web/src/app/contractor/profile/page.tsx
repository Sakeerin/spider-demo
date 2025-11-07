'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { contractorsApi } from '@/lib/api/contractors';
import { usersApi } from '@/lib/api/users';
import { ContractorProfileForm } from '@/components/profile/contractor-profile-form';
import { PortfolioManager } from '@/components/profile/portfolio-manager';
import { UserProfileForm } from '@/components/profile/user-profile-form';
import { UpdateUserDto } from '@spider/shared/types/user';
import { UpdateContractorDto, CreatePortfolioItemDto, UpdatePortfolioItemDto } from '@spider/shared/types/contractor';

export default function ContractorProfilePage() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [contractorData, setContractorData] = useState<any>(null);
  const [hasContractorProfile, setHasContractorProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'user' | 'contractor' | 'portfolio'>('user');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setToken(accessToken);
    if (accessToken) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const user = await usersApi.getMe(token!);
      setUserData(user);

      try {
        const contractor = await contractorsApi.getMe(token!);
        setContractorData(contractor);
        setHasContractorProfile(true);
      } catch (error) {
        setHasContractorProfile(false);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (data: UpdateUserDto) => {
    await usersApi.updateMe(token!, data);
    await loadData();
  };

  const handleUpdateContractor = async (data: UpdateContractorDto) => {
    await contractorsApi.updateMe(token!, data);
    await loadData();
  };

  const handleCreateContractor = async (data: any) => {
    await contractorsApi.create(token!, data);
    await loadData();
    setActiveTab('contractor');
  };

  const handleAddPortfolio = async (data: CreatePortfolioItemDto) => {
    await contractorsApi.createPortfolioItem(token!, data);
    await loadData();
  };

  const handleUpdatePortfolio = async (id: string, data: UpdatePortfolioItemDto) => {
    await contractorsApi.updatePortfolioItem(token!, id, data);
    await loadData();
  };

  const handleDeletePortfolio = async (id: string) => {
    await contractorsApi.deletePortfolioItem(token!, id);
    await loadData();
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
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Contractor Profile</h1>

        {!hasContractorProfile && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              You don't have a contractor profile yet. Create one to start receiving job opportunities.
            </p>
          </div>
        )}

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('user')}
              className={`py-2 px-4 border-b-2 font-medium ${
                activeTab === 'user'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('contractor')}
              className={`py-2 px-4 border-b-2 font-medium ${
                activeTab === 'contractor'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Business Profile
            </button>
            {hasContractorProfile && (
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-2 px-4 border-b-2 font-medium ${
                  activeTab === 'portfolio'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Portfolio
              </button>
            )}
          </nav>
        </div>

        {activeTab === 'user' && (
          <UserProfileForm user={userData} onSubmit={handleUpdateUser} />
        )}

        {activeTab === 'contractor' && (
          <>
            {hasContractorProfile ? (
              <ContractorProfileForm
                contractor={contractorData}
                onSubmit={handleUpdateContractor}
              />
            ) : (
              <ContractorProfileForm
                isCreate={true}
                onSubmit={handleCreateContractor}
              />
            )}
          </>
        )}

        {activeTab === 'portfolio' && hasContractorProfile && (
          <PortfolioManager
            portfolio={contractorData?.portfolio || []}
            onAdd={handleAddPortfolio}
            onUpdate={handleUpdatePortfolio}
            onDelete={handleDeletePortfolio}
          />
        )}
      </div>
    </div>
  );
}
