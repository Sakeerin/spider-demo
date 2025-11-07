'use client';

import { useState } from 'react';
import {
  IContractor,
  VerificationStatus,
} from '@spider/shared/types/contractor';

interface ContractorApprovalListProps {
  contractors: IContractor[];
  onApprove: (
    id: string,
    isApproved: boolean,
    verification: VerificationStatus
  ) => Promise<void>;
}

export function ContractorApprovalList({
  contractors,
  onApprove,
}: ContractorApprovalListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApprove = async (id: string, approved: boolean) => {
    setIsLoading(id);
    try {
      await onApprove(
        id,
        approved,
        approved ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED
      );
    } catch (error) {
      console.error('Failed to approve contractor:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (contractors.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-center text-gray-500">
          No pending contractor approvals
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Pending Contractor Approvals</h2>
        <p className="text-sm text-gray-600 mt-1">
          {contractors.length} contractor{contractors.length !== 1 ? 's' : ''}{' '}
          waiting for approval
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {contractors.map((contractor) => (
          <div key={contractor.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {contractor.businessName}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {(contractor as any).user?.email || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span>{' '}
                    {contractor.experience} years
                  </p>
                  <p>
                    <span className="font-medium">Services:</span>{' '}
                    {contractor.services
                      .map((s) => s.replace(/_/g, ' '))
                      .join(', ')}
                  </p>
                  <p>
                    <span className="font-medium">Service Areas:</span>{' '}
                    {contractor.serviceAreas
                      .map((a) => a.replace(/_/g, ' '))
                      .join(', ')}
                  </p>
                </div>

                {expandedId === contractor.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    {contractor.description && (
                      <div className="mb-3">
                        <p className="font-medium text-sm text-gray-700">
                          Description:
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {contractor.description}
                        </p>
                      </div>
                    )}
                    {contractor.website && (
                      <div className="mb-3">
                        <p className="font-medium text-sm text-gray-700">
                          Website:
                        </p>
                        <a
                          href={contractor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {contractor.website}
                        </a>
                      </div>
                    )}
                    {contractor.businessLicense && (
                      <div className="mb-3">
                        <p className="font-medium text-sm text-gray-700">
                          Business License:
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {contractor.businessLicense}
                        </p>
                      </div>
                    )}
                    {(contractor as any).portfolio &&
                      (contractor as any).portfolio.length > 0 && (
                        <div>
                          <p className="font-medium text-sm text-gray-700 mb-2">
                            Portfolio:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {(contractor as any).portfolio
                              .slice(0, 6)
                              .map((item: any) => (
                                <div key={item.id} className="aspect-square">
                                  {item.images[0] && (
                                    <img
                                      src={item.images[0]}
                                      alt={item.title}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                <button
                  onClick={() => toggleExpand(contractor.id)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  {expandedId === contractor.id
                    ? 'Show less'
                    : 'Show more details'}
                </button>
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <button
                  onClick={() => handleApprove(contractor.id, true)}
                  disabled={isLoading === contractor.id}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading === contractor.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleApprove(contractor.id, false)}
                  disabled={isLoading === contractor.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading === contractor.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
