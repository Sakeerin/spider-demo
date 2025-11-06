import { UserRole, IUser, IUserProfile } from '@spider/shared';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthUser extends Omit<IUser, 'password'> {
  profile?: IUserProfile;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface MagicLinkPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  iat?: number;
  exp?: number;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface RolePermissions {
  [UserRole.VISITOR]: Permission[];
  [UserRole.CUSTOMER]: Permission[];
  [UserRole.CONTRACTOR]: Permission[];
  [UserRole.COORDINATOR]: Permission[];
  [UserRole.SALES]: Permission[];
  [UserRole.ADMIN]: Permission[];
}