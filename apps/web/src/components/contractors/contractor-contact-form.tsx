'use client';

import { FormEvent, useState } from 'react';

interface ContractorContactFormProps {
  contractorName: string;
}

export function ContractorContactForm({
  contractorName,
}: ContractorContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        Message sent to {contractorName}. A coordinator will follow up shortly
        to confirm project details.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-900">
        Contact contractor
      </h2>
      <p className="text-sm text-slate-600">
        Share your scope and expected budget to receive a tailored response.
      </p>
      <input
        required
        type="text"
        placeholder="Full name"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
      />
      <input
        required
        type="tel"
        placeholder="Phone number"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
      />
      <input
        required
        type="text"
        placeholder="Project location"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
      />
      <select
        required
        defaultValue=""
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
      >
        <option value="" disabled>
          Estimated project budget
        </option>
        <option>Under THB 250K</option>
        <option>THB 250K - 900K</option>
        <option>THB 900K - 2M</option>
        <option>More than THB 2M</option>
      </select>
      <textarea
        required
        rows={4}
        placeholder="Project details"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Send inquiry
      </button>
    </form>
  );
}
