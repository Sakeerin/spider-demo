'use client';

import { useState } from 'react';
import { jobsApi } from '@/lib/api/jobs';
import { useAuthToken } from '@/lib/auth/use-auth-token';
import type { IJobWithDetails } from '@spider/shared/types/job';

interface QuoteApprovalProps {
  job: IJobWithDetails;
  onSuccess?: () => void;
}

export function QuoteApproval({ job, onSuccess }: QuoteApprovalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const token = useAuthToken();

  const handleApprove = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await jobsApi.approveQuote(token, { jobId: job.id });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to approve quote');
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  if (!job.quoteAmount || job.quoteApprovedAt) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Quote Approval</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Quote Amount:</span>
          <span className="text-xl font-bold">฿{job.quoteAmount.toLocaleString()}</span>
        </div>

        {job.quoteDocument && (
          <div className="py-2">
            <a
              href={job.quoteDocument}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              View Quote Document
            </a>
          </div>
        )}

        <div className="py-2">
          <h4 className="font-medium mb-2">Milestones:</h4>
          <div className="space-y-2">
            {job.milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{index + 1}. {milestone.title}</p>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-medium">฿{milestone.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {!showConfirmation ? (
          <button
            onClick={() => setShowConfirmation(true)}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            Approve Quote
          </button>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to approve this quote? This will start the project and create the milestone payment schedule.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Approving...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
