'use client';

import { useState } from 'react';
import { matchingApi } from '@/lib/api/matching';

interface ContractorResponseFormProps {
  leadAssignmentId: string;
  token: string;
  leadDetails: {
    serviceType: string;
    description: string;
    location: string;
    budget?: string;
    urgency: string;
  };
  onResponse?: (response: 'ACCEPTED' | 'DECLINED') => void;
}

const DECLINE_REASONS = [
  'Too busy with current projects',
  'Outside my service area',
  'Budget does not match my rates',
  'Not my area of expertise',
  'Timeline does not work for me',
  'Other',
];

export function ContractorResponseForm({
  leadAssignmentId,
  token,
  leadDetails,
  onResponse,
}: ContractorResponseFormProps) {
  const [loading, setLoading] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);

    try {
      await matchingApi.respondToMatch(token, {
        leadAssignmentId,
        response: 'ACCEPTED',
      });

      setSuccess(true);
      onResponse?.('ACCEPTED');
    } catch (err: any) {
      setError(err.message || 'Failed to accept lead');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason) {
      setError('Please select a reason for declining');
      return;
    }

    if (declineReason === 'Other' && !customReason.trim()) {
      setError('Please provide a reason');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await matchingApi.respondToMatch(token, {
        leadAssignmentId,
        response: 'DECLINED',
        declineReason: declineReason === 'Other' ? customReason : declineReason,
      });

      setSuccess(true);
      onResponse?.('DECLINED');
    } catch (err: any) {
      setError(err.message || 'Failed to decline lead');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <h3 className="font-semibold text-green-900">Response Submitted</h3>
            <p className="text-sm text-green-700 mt-1">
              {showDeclineForm
                ? 'You have declined this lead. We will find another contractor for the customer.'
                : 'You have accepted this lead! The customer will be notified and you can proceed with the quotation.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Lead Details</h3>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm text-gray-600">Service Type</dt>
            <dd className="text-sm font-medium text-gray-900">
              {leadDetails.serviceType}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Description</dt>
            <dd className="text-sm text-gray-900">{leadDetails.description}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Location</dt>
            <dd className="text-sm text-gray-900">{leadDetails.location}</dd>
          </div>
          {leadDetails.budget && (
            <div>
              <dt className="text-sm text-gray-600">Budget</dt>
              <dd className="text-sm text-gray-900">{leadDetails.budget}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-gray-600">Urgency</dt>
            <dd className="text-sm text-gray-900">
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  leadDetails.urgency === 'HIGH'
                    ? 'bg-red-100 text-red-800'
                    : leadDetails.urgency === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {leadDetails.urgency}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!showDeclineForm ? (
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : 'Accept Lead'}
          </button>
          <button
            onClick={() => setShowDeclineForm(true)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
          >
            Decline
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Declining
            </label>
            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select a reason...</option>
              {DECLINE_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {declineReason === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your reason..."
                disabled={loading}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              disabled={loading || !declineReason}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Processing...' : 'Confirm Decline'}
            </button>
            <button
              onClick={() => {
                setShowDeclineForm(false);
                setDeclineReason('');
                setCustomReason('');
                setError(null);
              }}
              disabled={loading}
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
