// User types
export enum UserRole {
  VISITOR = 'VISITOR',
  CUSTOMER = 'CUSTOMER',
  CONTRACTOR = 'CONTRACTOR',
  COORDINATOR = 'COORDINATOR',
  SALES = 'SALES',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service types
export enum ServiceType {
  CONSTRUCTION = 'CONSTRUCTION',
  RENOVATION = 'RENOVATION',
  INTERIOR_DESIGN = 'INTERIOR_DESIGN',
  REPAIRS = 'REPAIRS',
  SMART_HOME = 'SMART_HOME',
  SOLAR_INSTALLATION = 'SOLAR_INSTALLATION',
  EV_CHARGER = 'EV_CHARGER',
}

// Lead and Job types
export enum LeadStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  QUOTED = 'QUOTED',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum JobStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID',
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
