'use client';

import { useState, useEffect } from 'react';
import {
  ILeadWithAssignments,
  LeadSearchFilters,
} from '@spider/shared/types/lead';
import { leadsApi } from '@/lib/api/leads';
import { useAuth } from '@/lib/auth/auth-context';
import {
  ServiceType,
  UrgencyLevel,
  LeadStatus,
} from '@spider/shared/types/common';
import { Province } from '@spider/shared/types/user';

export function LeadManagementDashboard() {
  const [leads, setLeads] = useState<ILeadWithAssignments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadSearchFilters>({});
  const [selectedLead, setSelectedLead] = useState<ILeadWithAssignments | null>(
    null
  );
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    quoted: 0,
  });

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const loadLeads = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await leadsApi.getLeads(token, filters);
      setLeads(result.leads);

      // Calculate stats
      const pending = result.leads.filter(
        (l) => l.status === LeadStatus.PENDING
      ).length;
      const assigned = result.leads.filter(
        (l) => l.status === LeadStatus.ASSIGNED
      ).length;
      const quoted = result.leads.filter(
        (l) => l.status === LeadStatus.QUOTED
      ).length;

      setStats({
        total: result.total,
        pending,
        assigned,
        quoted,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof LeadSearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Leads</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.total}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Pending</div>
          <div className="mt-2 text-3xl font-semibold text-yellow-600">
            {stats.pending}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Assigned</div>
          <div className="mt-2 text-3xl font-semibold text-blue-600">
            {stats.assigned}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Quoted</div>
          <div className="mt-2 text-3xl font-semibold text-purple-600">
            {stats.quoted}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status?.[0] || ''}
              onChange={(e) =>
                handleFilterChange(
                  'status',
                  e.target.value ? [e.target.value as LeadStatus] : undefined
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={LeadStatus.PENDING}>Pending</option>
              <option value={LeadStatus.ASSIGNED}>Assigned</option>
              <option value={LeadStatus.QUOTED}>Quoted</option>
              <option value={LeadStatus.APPROVED}>Approved</option>
              <option value={LeadStatus.IN_PROGRESS}>In Progress</option>
              <option value={LeadStatus.COMPLETED}>Completed</option>
              <option value={LeadStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Type
            </label>
            <select
              value={filters.serviceType?.[0] || ''}
              onChange={(e) =>
                handleFilterChange(
                  'serviceType',
                  e.target.value ? [e.target.value as ServiceType] : undefined
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Services</option>
              <option value={ServiceType.CONSTRUCTION}>Construction</option>
              <option value={ServiceType.RENOVATION}>Renovation</option>
              <option value={ServiceType.INTERIOR_DESIGN}>
                Interior Design
              </option>
              <option value={ServiceType.REPAIRS}>Repairs</option>
              <option value={ServiceType.SMART_HOME}>Smart Home</option>
              <option value={ServiceType.SOLAR_INSTALLATION}>
                Solar Installation
              </option>
              <option value={ServiceType.EV_CHARGER}>EV Charger</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Urgency
            </label>
            <select
              value={filters.urgency?.[0] || ''}
              onChange={(e) =>
                handleFilterChange(
                  'urgency',
                  e.target.value ? [e.target.value as UrgencyLevel] : undefined
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Urgencies</option>
              <option value={UrgencyLevel.LOW}>Low</option>
              <option value={UrgencyLevel.MEDIUM}>Medium</option>
              <option value={UrgencyLevel.HIGH}>High</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
          <button
            onClick={loadLeads}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Leads</h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
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
                      {lead.serviceType.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.city}, {lead.province}
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
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
