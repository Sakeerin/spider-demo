'use client';

import { useState, useEffect } from 'react';
import { ILeadWithAssignments } from '@spider/shared/types/lead';
import { leadsApi } from '@/lib/api/leads';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { LeadStatus } from '@spider/shared/types/common';

export default function CustomerLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<ILeadWithAssignments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMyLeads();
  }, []);

  const loadMyLeads = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await leadsApi.getMyLeads(token);
      setLeads(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case LeadStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case LeadStatus.QUOTED:
        return 'bg-purple-100 text-purple-800';
      case LeadStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case LeadStatus.IN_PROGRESS:
        return 'bg-indigo-100 text-indigo-800';
      case LeadStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case LeadStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Leads</h1>
          <p className="mt-2 text-gray-600">
            Track your project requests and contractor matches
          </p>
        </div>
        <button
          onClick={() => router.push('/customer/leads/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit New Lead
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">
            You haven&apos;t submitted any leads yet
          </p>
          <button
            onClick={() => router.push('/customer/leads/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Your First Lead
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lead.serviceType.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(lead.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}
                >
                  {lead.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">{lead.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">
                    {lead.city}, {lead.province}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Urgency</p>
                  <p className="text-sm text-gray-900">{lead.urgency}</p>
                </div>
                {(lead.budgetMin || lead.budgetMax) && (
                  <div>
                    <p className="text-sm text-gray-500">Budget Range</p>
                    <p className="text-sm text-gray-900">
                      {lead.budgetMin
                        ? `฿${lead.budgetMin.toLocaleString()}`
                        : 'N/A'}{' '}
                      -{' '}
                      {lead.budgetMax
                        ? `฿${lead.budgetMax.toLocaleString()}`
                        : 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              {lead.leadAssignments && lead.leadAssignments.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Assigned Contractors ({lead.leadAssignments.length})
                  </p>
                  <div className="space-y-2">
                    {lead.leadAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-900">
                          {assignment.contractor?.businessName}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            assignment.response === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : assignment.response === 'DECLINED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {assignment.response || 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => router.push(`/customer/leads/${lead.id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
