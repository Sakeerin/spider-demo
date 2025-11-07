'use client';

import { useState, useEffect } from 'react';
import {
  matchingApi,
  ContractorAvailability,
  ContractorWorkload,
} from '@/lib/api/matching';

interface ContractorAvailabilityDisplayProps {
  contractorId: string;
  token: string;
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function ContractorAvailabilityDisplay({
  contractorId,
  token,
}: ContractorAvailabilityDisplayProps) {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] =
    useState<ContractorAvailability | null>(null);
  const [workload, setWorkload] = useState<ContractorWorkload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [contractorId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [availData, workloadData] = await Promise.all([
        matchingApi.checkAvailability(token, contractorId),
        matchingApi.getWorkload(token, contractorId),
      ]);

      setAvailability(availData);
      setWorkload(workloadData);
    } catch (err: any) {
      setError(err.message || 'Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading availability...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  if (!availability || !workload) {
    return null;
  }

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-lg font-semibold mt-1">
            {availability.isAvailable ? (
              <span className="text-green-600">Available</span>
            ) : (
              <span className="text-red-600">Unavailable</span>
            )}
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">Active Jobs</p>
          <p className="text-lg font-semibold mt-1">
            {workload.activeJobs} / {workload.maxJobs}
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">Utilization</p>
          <p
            className={`text-lg font-semibold mt-1 ${getUtilizationColor(workload.utilizationRate)}`}
          >
            {workload.utilizationRate.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Weekly Schedule</h4>
        {availability.weeklyAvailability.length === 0 ? (
          <p className="text-sm text-gray-500">No schedule set</p>
        ) : (
          <div className="space-y-2">
            {availability.weeklyAvailability
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((schedule) => (
                <div
                  key={schedule.dayOfWeek}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {DAYS[schedule.dayOfWeek]}
                  </span>
                  <span className="text-sm text-gray-600">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {workload.pendingMilestones > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {workload.pendingMilestones} pending milestone(s) across active jobs
          </p>
        </div>
      )}
    </div>
  );
}
