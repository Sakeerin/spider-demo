'use client';

import { LeadForm } from '@/components/leads/lead-form';
import { useRouter } from 'next/navigation';

export default function NewLeadPage() {
  const router = useRouter();

  const handleSuccess = (lead: any) => {
    // Show success message and redirect
    alert('Lead submitted successfully! We will contact you soon.');
    router.push('/customer/leads');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Submit a New Lead</h1>
        <p className="mt-2 text-gray-600">
          Tell us about your project and we&apos;ll match you with qualified
          contractors
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <LeadForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}
