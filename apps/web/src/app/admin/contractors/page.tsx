'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { contractorsApi } from '@/lib/api/contractors';
import { ContractorApprovalList } from '@/components/admin/contractor-approval-list';
import { VerificationStatus } from '@spider/shared/types/contractor';

export default function AdminContractorsPage() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [contractors, setContractors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setToken(accessToken);
    if (accessToken) {
      loadPendingApprovals();
    }
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const data = await contractorsApi.getPendingApprovals(token!);
      setContractors(data);
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (
    id: string,
    isApproved: boolean,
    verification: VerificationStatus
  ) => {
    await contractorsApi.approve(token!, id, isApproved, verification);
    await loadPendingApprovals();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Contractor Management</h1>

        <ContractorApprovalList
          contractors={contractors}
          onApprove={handleApprove}
        />
      </div>
    </div>
  );
}
