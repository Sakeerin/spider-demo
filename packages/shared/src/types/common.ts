// Common types and enums used across the application

export enum ServiceType {
  CONSTRUCTION = 'CONSTRUCTION',
  RENOVATION = 'RENOVATION',
  INTERIOR_DESIGN = 'INTERIOR_DESIGN',
  REPAIRS = 'REPAIRS',
  SMART_HOME = 'SMART_HOME',
  SOLAR_INSTALLATION = 'SOLAR_INSTALLATION',
  EV_CHARGER = 'EV_CHARGER',
}

export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

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

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  LINE = 'LINE',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export enum ProductCategory {
  SOLAR = 'SOLAR',
  EV_CHARGER = 'EV_CHARGER',
  SMART_DEVICE = 'SMART_DEVICE',
}

// Common interfaces
export interface BudgetRange {
  min?: number;
  max?: number;
}

export interface Location {
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
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

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}

// Common DTOs
export interface PaginationDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchDto extends PaginationDto {
  query?: string;
  filters?: Record<string, any>;
}

// File upload types
export interface FileUpload {
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
}

export interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: Date;
}