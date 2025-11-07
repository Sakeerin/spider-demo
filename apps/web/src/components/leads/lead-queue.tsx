'use client';

import { useState, useEffect } from 'react';
import { ILeadWithAssignments } from '@spider/shared/types/lead';
import { leadsApi } from '@/lib/api/leads';
import { useAuth } from '@/lib/auth/auth-context';
import {
  ServiceType,
  UrgencyLevel,
  LeadStatus,
} from '@spider/shared/types/common';

export function LeadQueue() {
  const [leads, setLeads] = useState<ILeadWithAssignments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<ILeadWithAssignments | null>(
    null
  );

  useEffect(() => {
    loadLeadQueue();
  }, []);

  const loadLeadQueue = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await leadsApi.getLeadQueue(token);
      setLeads(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load lead queue');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case UrgencyLevel.HIGH:
        return 'bg-red-100 text-red-800';
      case UrgencyLevel.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case UrgencyLevel.LOW:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      case LeadStatus.ASSIGNED:
        return 'bg-purple-100 text-purple-800';
      case LeadStatus.QUOTED:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatServiceType = (type: ServiceType) => {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lead Queue</h2>
        <button
          onClick={loadLeadQueue}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No leads in queue</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lead.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.customer?.firstName} {lead.customer?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatServiceType(lead.serviceType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.city}, {lead.province}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyColor(lead.urgency)}`}
                    >
                      {lead.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={loadLeadQueue}
        />
      )}
    </div>
  );
}

interface LeadDetailsModalProps {
  lead: ILeadWithAssignments;
  onClose: () => void;
  onUpdate: () => void;
}

function LeadDetailsModal({ lead, onClose, onUpdate }: LeadDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Lead Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              Customer Information
            </h4>
            <p className="mt-1 text-sm text-gray-900">
              {lead.customer?.firstName} {lead.customer?.lastName}
            </p>
            <p className="text-sm text-gray-500">{lead.customer?.email}</p>
            {lead.customer?.phone && (
              <p className="text-sm text-gray-500">{lead.customer.phone}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">
              Service Details
            </h4>
            <p className="mt-1 text-sm text-gray-900">
              Service Type: {lead.serviceType.replace(/_/g, ' ')}
            </p>
            <p className="text-sm text-gray-900">Urgency: {lead.urgency}</p>
            <p className="text-sm text-gray-900">Status: {lead.status}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1 text-sm text-gray-900">{lead.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Location</h4>
            <p className="mt-1 text-sm text-gray-900">{lead.address}</p>
            <p className="text-sm text-gray-900">
              {lead.city}, {lead.province} {lead.postalCode}
            </p>
          </div>

          {(lead.budgetMin || lead.budgetMax) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Budget Range
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {lead.budgetMin ? `฿${lead.budgetMin.toLocaleString()}` : 'N/A'}{' '}
                -{' '}
                {lead.budgetMax ? `฿${lead.budgetMax.toLocaleString()}` : 'N/A'}
              </p>
            </div>
          )}

          {lead.preferredContactTime && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Preferred Contact Time
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {lead.preferredContactTime}
              </p>
            </div>
          )}

          {lead.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Additional Notes
              </h4>
              <p className="mt-1 text-sm text-gray-900">{lead.notes}</p>
            </div>
          )}

          {lead.leadAssignments && lead.leadAssignments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Assigned Contractors
              </h4>
              <ul className="mt-2 space-y-2">
                {lead.leadAssignments.map((assignment) => (
                  <li key={assignment.id} className="text-sm text-gray-900">
                    {assignment.contractor?.businessName} -{' '}
                    {assignment.response || 'Pending'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              // TODO: Navigate to assignment page
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Assign Contractors
          </button>
        </div>
      </div>
    </div>
  );
}
