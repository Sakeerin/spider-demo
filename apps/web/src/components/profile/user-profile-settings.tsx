'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UpdateUserProfileDto, Province } from '@spider/shared/types/user';

interface UserProfileSettingsProps {
  profile: any;
  onSubmit: (data: UpdateUserProfileDto) => Promise<void>;
}

export function UserProfileSettings(props: UserProfileSettingsProps) {
  const { profile, onSubmit } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValues = {
    emailNotifications:
      profile?.emailNotifications !== undefined
        ? profile.emailNotifications
        : true,
    smsNotifications:
      profile?.smsNotifications !== undefined
        ? profile.smsNotifications
        : false,
    lineNotifications:
      profile?.lineNotifications !== undefined
        ? profile.lineNotifications
        : true,
    inAppNotifications:
      profile?.inAppNotifications !== undefined
        ? profile.inAppNotifications
        : true,
    address: profile?.address || '',
    city: profile?.city || '',
    province: profile?.province || undefined,
    postalCode: profile?.postalCode || '',
    timezone: profile?.timezone || 'Asia/Bangkok',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserProfileDto>({ defaultValues });

  const handleFormSubmit = async (data: UpdateUserProfileDto) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            Settings updated successfully!
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('emailNotifications')}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Email notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('smsNotifications')}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">SMS notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('lineNotifications')}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">LINE notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('inAppNotifications')}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">In-app notifications</span>
          </label>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Address Information</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              {...register('address')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                {...register('city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Province
              </label>
              <select
                id="province"
                {...register('province')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Province</option>
                {Object.values(Province).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                {...register('postalCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Timezone
              </label>
              <select
                id="timezone"
                {...register('timezone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Asia/Bangkok">Asia/Bangkok</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
