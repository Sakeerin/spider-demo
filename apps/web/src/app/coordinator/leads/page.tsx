'use client';

import { LeadQueue } from '@/components/leads/lead-queue';
import { LeadManagementDashboard } from '@/components/leads/lead-management-dashboard';
import { useState } from 'react';

export default function CoordinatorLeadsPage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'all'>('queue');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
        <p className="mt-2 text-gray-600">
          Manage and assign leads to contractors
        </p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('queue')}
              className={`${
                activeTab === 'queue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Lead Queue
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Leads
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'queue' ? <LeadQueue /> : <LeadManagementDashboard />}
    </div>
  );
}
