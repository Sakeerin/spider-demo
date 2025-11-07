'use client';

import { useState } from 'react';
import { jobsApi } from '@/lib/api/jobs';
import { useAuthToken } from '@/lib/auth/use-auth-token';
import type { IMilestone } from '@spider/shared/types/job';

interface MilestoneTrackerProps {
  milestones: IMilestone[];
  jobId: string;
  canUpdate?: boolean;
  onUpdate?: () => void;
}

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REVIEW: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  PAID: 'bg-purple-100 text-purple-800',
};

const statusLabels = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Under Review',
  COMPLETED: 'Completed',
  PAID: 'Paid',
};

export function MilestoneTracker({ milestones, jobId, canUpdate = false, onUpdate }: MilestoneTrackerProps) {
  const [updatingMilestone, setUpdatingMilestone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthToken();

  const handleStatusUpdate = async (milestoneId: string, newStatus: string) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setUpdatingMilestone(milestoneId);
    setError(null);

    try {
      await jobsApi.updateMilestoneStatus(token, milestoneId, { status: newStatus });
      onUpdate?.();
    } catch (err: any) {
      setError(err.message || 'Failed to update milestone status');
    } finally {
      setUpdatingMilestone(null);
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const transitions: Record<string, string> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'REVIEW',
      REVIEW: 'COMPLETED',
      COMPLETED: 'PAID',
    };
    return transitions[currentStatus] || null;
  };

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const paidAmount = milestones
    .filter((m) => m.status === 'PAID')
    .reduce((sum, m) => sum + m.amount, 0);
  const progressPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Project Milestones</h3>
          <span className="text-sm text-gray-600">
            {milestones.filter((m) => m.status === 'COMPLETED' || m.status === 'PAID').length} of{' '}
            {milestones.length} completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Paid: ฿{paidAmount.toLocaleString()}</span>
          <span>Total: ฿{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const nextStatus = getNextStatus(milestone.status);
          const isOverdue =
            milestone.status !== 'COMPLETED' &&
            milestone.status !== 'PAID' &&
            new Date(milestone.dueDate) < new Date();

          return (
            <div
              key={milestone.id}
              className={`border rounded-lg p-4 ${
                isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {index + 1}. {milestone.title}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[milestone.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[milestone.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                  )}
                </div>
                <span className="font-semibold text-gray-900 ml-4">
                  ฿{milestone.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                  {milestone.completedAt && (
                    <span className="ml-4">
                      Completed: {new Date(milestone.completedAt).toLocaleDateString()}
                    </span>
                  )}
                  {isOverdue && (
                    <span className="ml-4 text-red-600 font-medium">Overdue</span>
                  )}
                </div>

                {canUpdate && nextStatus && (
                  <button
                    onClick={() => handleStatusUpdate(milestone.id, nextStatus)}
                    disabled={updatingMilestone === milestone.id}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {updatingMilestone === milestone.id
                      ? 'Updating...'
                      : `Mark as ${statusLabels[nextStatus as keyof typeof statusLabels]}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
