import { UserRole } from '@spider/shared';
import { RolePermissions, Permission } from '../interfaces/auth.interface';

// Define permissions for each resource
const USER_PERMISSIONS: Permission = {
  resource: 'users',
  actions: ['create', 'read', 'update', 'delete'],
};

const PROFILE_PERMISSIONS: Permission = {
  resource: 'profiles',
  actions: ['create', 'read', 'update', 'delete'],
};

const LEAD_PERMISSIONS: Permission = {
  resource: 'leads',
  actions: ['create', 'read', 'update', 'delete'],
};

const JOB_PERMISSIONS: Permission = {
  resource: 'jobs',
  actions: ['create', 'read', 'update', 'delete'],
};

const CONTRACTOR_PERMISSIONS: Permission = {
  resource: 'contractors',
  actions: ['create', 'read', 'update', 'delete'],
};

const REVIEW_PERMISSIONS: Permission = {
  resource: 'reviews',
  actions: ['create', 'read', 'update', 'delete'],
};

const NOTIFICATION_PERMISSIONS: Permission = {
  resource: 'notifications',
  actions: ['create', 'read', 'update', 'delete'],
};

const PRODUCT_PERMISSIONS: Permission = {
  resource: 'products',
  actions: ['create', 'read', 'update', 'delete'],
};

const PROMOTION_PERMISSIONS: Permission = {
  resource: 'promotions',
  actions: ['create', 'read', 'update', 'delete'],
};

const AUDIT_PERMISSIONS: Permission = {
  resource: 'audit-logs',
  actions: ['read'],
};

// Define role-based permissions
export const ROLE_PERMISSIONS: RolePermissions = {
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
    USER_PERMISSIONS,
    PROFILE_PERMISSIONS,
    LEAD_PERMISSIONS,
    JOB_PERMISSIONS,
    CONTRACTOR_PERMISSIONS,
    REVIEW_PERMISSIONS,
    NOTIFICATION_PERMISSIONS,
    PRODUCT_PERMISSIONS,
    PROMOTION_PERMISSIONS,
    AUDIT_PERMISSIONS,
  ],
};

// Helper function to check if a user has permission for a specific action
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete',
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  
  return rolePermissions.some(
    (permission) =>
      permission.resource === resource && permission.actions.includes(action),
  );
}

// Helper function to get all permissions for a role
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole];
}