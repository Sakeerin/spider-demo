'use client';

import { useMemo, useCallback } from 'react';
import { UserRole } from '@spider/shared';
import { useAuth } from './auth-context';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Role-based permissions (should match backend configuration)
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.VISITOR]: [
    { resource: 'products', actions: ['read'] },
    { resource: 'promotions', actions: ['read'] },
    { resource: 'contractors', actions: ['read'] },
    { resource: 'leads', actions: ['create'] },
  ],

  [UserRole.CUSTOMER]: [
    { resource: 'products', actions: ['read'] },
    { resource: 'promotions', actions: ['read'] },
    { resource: 'contractors', actions: ['read'] },
    { resource: 'leads', actions: ['create', 'read', 'update'] },
    { resource: 'jobs', actions: ['read', 'update'] },
    { resource: 'profiles', actions: ['read', 'update'] },
    { resource: 'reviews', actions: ['create', 'read', 'update'] },
    { resource: 'notifications', actions: ['read', 'update'] },
  ],

  [UserRole.CONTRACTOR]: [
    { resource: 'products', actions: ['read'] },
    { resource: 'contractors', actions: ['read', 'update'] },
    { resource: 'leads', actions: ['read'] },
    { resource: 'jobs', actions: ['read', 'update'] },
    { resource: 'profiles', actions: ['read', 'update'] },
    { resource: 'reviews', actions: ['read'] },
    { resource: 'notifications', actions: ['read', 'update'] },
  ],

  [UserRole.COORDINATOR]: [
    { resource: 'products', actions: ['read'] },
    { resource: 'promotions', actions: ['read'] },
    { resource: 'contractors', actions: ['read', 'update'] },
    { resource: 'leads', actions: ['read', 'update'] },
    { resource: 'jobs', actions: ['read', 'update'] },
    { resource: 'profiles', actions: ['read'] },
    { resource: 'reviews', actions: ['read'] },
    { resource: 'notifications', actions: ['create', 'read', 'update'] },
  ],

  [UserRole.SALES]: [
    { resource: 'products', actions: ['read', 'update'] },
    { resource: 'promotions', actions: ['read', 'update'] },
    { resource: 'contractors', actions: ['read'] },
    { resource: 'leads', actions: ['read', 'update'] },
    { resource: 'jobs', actions: ['read', 'update'] },
    { resource: 'profiles', actions: ['read'] },
    { resource: 'reviews', actions: ['read'] },
    { resource: 'notifications', actions: ['create', 'read', 'update'] },
  ],

  [UserRole.ADMIN]: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'profiles', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'leads', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
    {
      resource: 'contractors',
      actions: ['create', 'read', 'update', 'delete'],
    },
    { resource: 'reviews', actions: ['create', 'read', 'update', 'delete'] },
    {
      resource: 'notifications',
      actions: ['create', 'read', 'update', 'delete'],
    },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'promotions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'audit-logs', actions: ['read'] },
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return ROLE_PERMISSIONS[UserRole.VISITOR];
    }
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user]);

  const hasPermission = useCallback(
    (resource: string, action: 'create' | 'read' | 'update' | 'delete') => {
      return permissions.some(
        (permission) =>
          permission.resource === resource &&
          permission.actions.includes(action)
      );
    },
    [permissions]
  );

  const canCreate = useCallback(
    (resource: string) => hasPermission(resource, 'create'),
    [hasPermission]
  );

  const canRead = useCallback(
    (resource: string) => hasPermission(resource, 'read'),
    [hasPermission]
  );

  const canUpdate = useCallback(
    (resource: string) => hasPermission(resource, 'update'),
    [hasPermission]
  );

  const canDelete = useCallback(
    (resource: string) => hasPermission(resource, 'delete'),
    [hasPermission]
  );

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const isAdmin = useMemo(() => hasRole(UserRole.ADMIN), [hasRole]);
  const isCustomer = useMemo(() => hasRole(UserRole.CUSTOMER), [hasRole]);
  const isContractor = useMemo(() => hasRole(UserRole.CONTRACTOR), [hasRole]);
  const isCoordinator = useMemo(() => hasRole(UserRole.COORDINATOR), [hasRole]);
  const isSales = useMemo(() => hasRole(UserRole.SALES), [hasRole]);

  return {
    permissions,
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    hasRole,
    isAdmin,
    isCustomer,
    isContractor,
    isCoordinator,
    isSales,
  };
}
