'use client';

import { useState, useEffect } from 'react';
import { matchingApi } from '@/lib/api/matching';
import { contractorsApi } from '@/lib/api/contractors';

interface MatchOverrideFormProps {
  leadId: string;
  token: string;
  onOverride?: () => void;
}

export function MatchOverrideForm({
  leadId,
  token,
  onOverride,
}: MatchOverrideFormProps) {
  const [loading, setLoading] = useState(false);
  const [contractors, setContractors] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      const response = await contractorsApi.getAll({ isAvailable: true });
      setContractors(response.contractors);
    } catch (err) {
      setError('Failed to load contractors');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      setError('Please select at least one contractor');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await matchingApi.overrideMatch(token, {
        leadId,
        contractorIds: selectedIds,
        reason: reason || undefined,
      });

      setSuccess(true);
      onOverride?.();
    } catch (err: any) {
      setError(err.message || 'Failed to override match');
    } finally {
      setLoading(false);
    }
  };

  const toggleContractor = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-900">
          Match Override Successful
        </h3>
        <p className="text-sm text-green-700 mt-1">
          Selected contractors have been assigned to this lead.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Contractors (Manual Assignment)
        </label>
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
          {contractors.map((contractor) => (
            <label
              key={contractor.id}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(contractor.id)}
                onChange={() => toggleContractor(contractor.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">
                  {contractor.businessName}
                </p>
                <p className="text-sm text-gray-600">
                  ⭐ {contractor.averageRating.toFixed(1)} •{' '}
                  {contractor.experience} years
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Override Reason (Optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Why are you manually assigning these contractors?"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || selectedIds.length === 0}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading
          ? 'Assigning...'
          : `Assign ${selectedIds.length} Contractor(s)`}
      </button>
    </form>
  );
}
