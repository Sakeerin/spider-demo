// Audit logging types and interfaces

export interface IAuditLog {
  id: string;
  userId?: string;
  action: string; // CREATE, UPDATE, DELETE, etc.
  resource: string; // jobs, milestones, users, etc.
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface IAuditLogWithUser extends IAuditLog {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

// Audit log creation DTO
export interface CreateAuditLogDto {
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// Audit log search and filtering
export interface AuditLogSearchFilters {
  userId?: string;
  action?: string[];
  resource?: string[];
  resourceId?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface AuditLogSearchResult {
  auditLogs: IAuditLogWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Audit statistics
export interface AuditStatistics {
  totalActions: number;
  actionBreakdown: Record<string, number>;
  resourceBreakdown: Record<string, number>;
  userBreakdown: Record<string, number>;
  dailyActivity: Array<{
    date: string;
    count: number;
  }>;
}