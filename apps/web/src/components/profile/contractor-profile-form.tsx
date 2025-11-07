'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ServiceType } from '@spider/shared/types/common';
import { Province } from '@spider/shared/types/user';
import { CreateContractorDto, UpdateContractorDto } from '@spider/shared/types/contractor';

interface ContractorProfileFormProps {
  contractor?: any;
  isCreate?: boolean;
  onSubmit: (data: CreateContractorDto | UpdateContractorDto) => Promise<void>;
}

export function ContractorProfileForm(props: ContractorProfileFormProps) {
  const { contractor, isCreate = false, onSubmit } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValues = {
    businessName: contractor?.businessName || '',
    services: contractor?.services || [],
    serviceAreas: contractor?.serviceAreas || [],
    experience: contractor?.experience || 0,
    description: contractor?.description || '',
    website: contractor?.website || '',
    businessLicense: contractor?.businessLicense || '',
    isAvailable: contractor?.isAvailable !== undefined ? contractor.isAvailable : true,
    maxConcurrentJobs: contractor?.maxConcurrentJobs || 3,
    prefersCatalogJobs: contractor?.prefersCatalogJobs !== undefined ? contractor.prefersCatalogJobs : false,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save contractor profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Business Information</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            {isCreate ? 'Contractor profile created successfully!' : 'Profile updated successfully!'}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              id="businessName"
              type="text"
              {...register('businessName', { required: 'Business name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{String(errors.businessName.message)}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell customers about your business..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                id="experience"
                type="number"
                min="0"
                {...register('experience', { required: 'Experience is required', min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{String(errors.experience.message)}</p>
              )}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                id="website"
                type="url"
                {...register('website')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-1">
              Business License Number
            </label>
            <input
              id="businessLicense"
              type="text"
              {...register('businessLicense')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Offered <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.values(ServiceType).map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    value={service}
                    {...register('services', { required: 'Select at least one service' })}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{String(service).replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="mt-1 text-sm text-red-600">{String(errors.services.message)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Areas <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
              {Object.values(Province).map((province) => (
                <label key={province} className="flex items-center">
                  <input
                    type="checkbox"
                    value={province}
                    {...register('serviceAreas', { required: 'Select at least one service area' })}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{String(province).replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
            {errors.serviceAreas && (
              <p className="mt-1 text-sm text-red-600">{String(errors.serviceAreas.message)}</p>
            )}
          </div>
        </div>
      </div>

      {!isCreate && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Availability Settings</h2>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isAvailable')}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Currently available for new jobs</span>
            </label>

            <div>
              <label htmlFor="maxConcurrentJobs" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Concurrent Jobs
              </label>
              <input
                id="maxConcurrentJobs"
                type="number"
                min="1"
                max="10"
                {...register('maxConcurrentJobs')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('prefersCatalogJobs')}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Prefer jobs from contractor catalog</span>
            </label>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : isCreate ? 'Create Profile' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
