'use client';

import React from 'react';
import { useAuth } from '../../lib/auth/auth-context';
import { usePermissions } from '../../lib/auth/use-permissions';
import { UserRole } from '@spider/shared';

export function UserProfile() {
  const { user, logout } = useAuth();
  const { hasRole, canUpdate } = usePermissions();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.role}</p>
        </div>

        {user.firstName && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
          </div>
        )}

        {user.lastName && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
          </div>
        )}

        {user.phone && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.language}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Member Since
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Show permissions info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Permissions
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Can update profile: {canUpdate('profiles') ? 'Yes' : 'No'}</p>
            <p>Can create leads: {canUpdate('leads') ? 'Yes' : 'No'}</p>
            <p>Is Admin: {hasRole(UserRole.ADMIN) ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
