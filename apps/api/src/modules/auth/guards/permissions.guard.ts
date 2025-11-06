import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission } from '../config/permissions.config';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

export interface RequiredPermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    return requiredPermissions.every((permission) =>
      hasPermission(user.role, permission.resource, permission.action),
    );
  }
}