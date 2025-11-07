'use client';

import { useParams } from 'next/navigation';
import { JobDetailView } from '@/components/jobs/job-detail-view';
import { useAuth } from '@/lib/auth/auth-context';

export default function ContractorJobDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const jobId = params.jobId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <JobDetailView jobId={jobId} userRole={user?.role} />
    </div>
  );
}
