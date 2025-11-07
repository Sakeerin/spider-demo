'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateLeadDto } from '@spider/shared/types/lead';
import { ServiceType, UrgencyLevel } from '@spider/shared/types/common';
import { Province } from '@spider/shared/types/user';
import { leadsApi } from '@/lib/api/leads';
import { useAuth } from '@/lib/auth/auth-context';

interface LeadFormProps {
  onSuccess?: (lead: any) => void;
  onCancel?: () => void;
  defaultServiceType?: ServiceType;
}

export function LeadForm({
  onSuccess,
  onCancel,
  defaultServiceType,
}: LeadFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateLeadDto>({
    defaultValues: {
      customerId: user?.id || '',
      serviceType: defaultServiceType || ServiceType.CONSTRUCTION,
      urgency: UrgencyLevel.MEDIUM,
    },
  });

  const onSubmit = async (data: CreateLeadDto) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You must be logged in to submit a lead');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const lead = await leadsApi.createLead(token, {
        ...data,
        customerId: user?.id || data.customerId,
      });

      if (onSuccess) {
        onSuccess(lead);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="serviceType"
          className="block text-sm font-medium text-gray-700"
        >
          Service Type *
        </label>
        <select
          id="serviceType"
          {...register('serviceType', { required: 'Service type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value={ServiceType.CONSTRUCTION}>Construction</option>
          <option value={ServiceType.RENOVATION}>Renovation</option>
          <option value={ServiceType.INTERIOR_DESIGN}>Interior Design</option>
          <option value={ServiceType.REPAIRS}>Repairs</option>
          <option value={ServiceType.SMART_HOME}>Smart Home</option>
          <option value={ServiceType.SOLAR_INSTALLATION}>
            Solar Installation
          </option>
          <option value={ServiceType.EV_CHARGER}>EV Charger</option>
        </select>
        {errors.serviceType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.serviceType.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Project Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe your project requirements..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="urgency"
          className="block text-sm font-medium text-gray-700"
        >
          Urgency Level
        </label>
        <select
          id="urgency"
          {...register('urgency')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value={UrgencyLevel.LOW}>Low - Flexible timeline</option>
          <option value={UrgencyLevel.MEDIUM}>Medium - Within a month</option>
          <option value={UrgencyLevel.HIGH}>High - Urgent</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address *
          </label>
          <input
            type="text"
            id="address"
            {...register('address', { required: 'Address is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City *
          </label>
          <input
            type="text"
            id="city"
            {...register('city', { required: 'City is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700"
          >
            Province *
          </label>
          <select
            id="province"
            {...register('province', { required: 'Province is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Province</option>
            <option value={Province.BANGKOK}>Bangkok</option>
            <option value={Province.NONTHABURI}>Nonthaburi</option>
            <option value={Province.PATHUM_THANI}>Pathum Thani</option>
            <option value={Province.SAMUT_PRAKAN}>Samut Prakan</option>
            <option value={Province.CHONBURI}>Chonburi</option>
            {/* Add more provinces as needed */}
          </select>
          {errors.province && (
            <p className="mt-1 text-sm text-red-600">
              {errors.province.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            {...register('postalCode')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="budgetMin"
            className="block text-sm font-medium text-gray-700"
          >
            Budget Min (THB)
          </label>
          <input
            type="number"
            id="budgetMin"
            {...register('budgetMin', { min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label
            htmlFor="budgetMax"
            className="block text-sm font-medium text-gray-700"
          >
            Budget Max (THB)
          </label>
          <input
            type="number"
            id="budgetMax"
            {...register('budgetMax', { min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="preferredContactTime"
          className="block text-sm font-medium text-gray-700"
        >
          Preferred Contact Time
        </label>
        <input
          type="text"
          id="preferredContactTime"
          {...register('preferredContactTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., Weekdays 9AM-5PM"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Additional Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any additional information..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Lead'}
        </button>
      </div>
    </form>
  );
}
