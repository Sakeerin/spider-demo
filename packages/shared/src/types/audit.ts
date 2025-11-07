// Audit log types

export interface IAuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ASSIGN = 'ASSIGN',
  COMPLETE = 'COMPLETE',
}

export enum AuditResource {
  USER = 'users',
  CONTRACTOR = 'contractors',
  LEAD = 'leads',
  JOB = 'jobs',
  MILESTONE = 'milestones',
  REVIEW = 'reviews',
  NOTIFICATION = 'notifications',
}
