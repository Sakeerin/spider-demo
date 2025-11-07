'use client';

import { useSearchParams } from 'next/navigation';
import { QuoteCreationForm } from '@/components/jobs/quote-creation-form';
import { useRouter } from 'next/navigation';

export default function NewQuotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Job ID is required to create a quote
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuoteCreationForm
        jobId={jobId}
        onSuccess={() => {
          router.push(`/sales/jobs/${jobId}`);
        }}
        onCancel={() => {
          router.back();
        }}
      />
    </div>
  );
}
