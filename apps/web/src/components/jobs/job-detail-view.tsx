'use client';

import { useEffect, useState } from 'react';
import { jobsApi } from '@/lib/api/jobs';
import { useAuthToken } from '@/lib/auth/use-auth-token';
import { MilestoneTracker } from './milestone-tracker';
import { QuoteApproval } from './quote-approval';
import type { IJobWithDetails } from '@spider/shared/types/job';

interface JobDetailViewProps {
  jobId: string;
  userRole?: string;
}

export function JobDetailView({ jobId, userRole }: JobDetailViewProps) {
  const [job, setJob] = useState<IJobWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthToken();

  const loadJob = async () => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await jobsApi.getJobWithDetails(token, jobId);
      setJob(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadJob();
    }
  }, [jobId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Job not found'}
      </div>
    );
  }

  const canUpdateMilestones = userRole === 'CONTRACTOR' || userRole === 'SALES' || userRole === 'ADMIN';
  const canApproveQuote = userRole === 'CUSTOMER' || userRole === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-gray-600 mt-1">{job.description}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              job.status === 'COMPLETED'
                ? 'bg-green-100 text-green-800'
                : job.status === 'IN_PROGRESS'
                ? 'bg-blue-100 text-blue-800'
                : job.status === 'CANCELLED'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {job.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-600">Contractor</p>
            <p className="font-medium">
              {job.contractor?.user.firstName} {job.contractor?.user.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-medium">
              {job.customer?.firstName} {job.customer?.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-medium text-lg">
              {job.totalAmount ? `฿${job.totalAmount.toLocaleString()}` : 'Pending Quote'}
            </p>
          </div>
        </div>

        {job.startDate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium">{new Date(job.startDate).toLocaleDateString()}</p>
            </div>
            {job.endDate && (
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">{new Date(job.endDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quote Approval (for customers) */}
      {canApproveQuote && !job.quoteApprovedAt && job.quoteAmount && (
        <QuoteApproval job={job} onSuccess={loadJob} />
      )}

      {/* Milestones */}
      {job.milestones.length > 0 && (
        <MilestoneTracker
          milestones={job.milestones}
          jobId={job.id}
          canUpdate={canUpdateMilestones}
          onUpdate={loadJob}
        />
      )}

      {/* Documents */}
      {job.documents.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Documents</h3>
          <div className="space-y-2">
            {job.documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{doc.filename}</p>
                  <p className="text-sm text-gray-600">
                    {(doc.fileSize / 1024).toFixed(2)} KB • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
