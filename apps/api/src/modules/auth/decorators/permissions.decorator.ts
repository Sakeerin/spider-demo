import { SetMetadata } from '@nestjs/common';
import { RequiredPermission } from '../guards/permissions.guard';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);