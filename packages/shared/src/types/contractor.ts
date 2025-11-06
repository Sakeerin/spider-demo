// Contractor-related types and interfaces

import { ServiceType } from './common';
import { Province } from './user';

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface IContractor {
  id: string;
  userId: string;
  businessName: string;
  services: ServiceType[];
  serviceAreas: Province[];
  experience: number;
  verification: VerificationStatus;
  isApproved: boolean;
  isActive: boolean;
  description?: string;
  website?: string;
  businessLicense?: string;
  averageRating: number;
  totalReviews: number;
  successRate: number;
  responseTime: number;
  isAvailable: boolean;
  maxConcurrentJobs: number;
  prefersCatalogJobs: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPortfolioItem {
  id: string;
  contractorId: string;
  title: string;
  description?: string;
  images: string[];
  serviceType: ServiceType;
  completedAt?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvailability {
  id: string;
  contractorId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContractorWithDetails extends IContractor {
  portfolio: IPortfolioItem[];
  availability: IAvailability[];
}

// Contractor rating aggregation
export interface IContractorRating {
  average: number;
  totalReviews: number;
  successRate: number;
  responseTime: number;
  qualityAverage?: number;
  timelinessAverage?: number;
  communicationAverage?: number;
  valueAverage?: number;
}

// DTOs for contractor operations
export interface CreateContractorDto {
  userId: string;
  businessName: string;
  services: ServiceType[];
  serviceAreas: Province[];
  experience: number;
  description?: string;
  website?: string;
  businessLicense?: string;
}

export interface UpdateContractorDto {
  businessName?: string;
  services?: ServiceType[];
  serviceAreas?: Province[];
  experience?: number;
  description?: string;
  website?: string;
  businessLicense?: string;
  isAvailable?: boolean;
  maxConcurrentJobs?: number;
  prefersCatalogJobs?: boolean;
}

export interface CreatePortfolioItemDto {
  contractorId: string;
  title: string;
  description?: string;
  images: string[];
  serviceType: ServiceType;
  completedAt?: Date;
  isPublic?: boolean;
}

export interface UpdatePortfolioItemDto {
  title?: string;
  description?: string;
  images?: string[];
  serviceType?: ServiceType;
  completedAt?: Date;
  isPublic?: boolean;
}

export interface CreateAvailabilityDto {
  contractorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface UpdateAvailabilityDto {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

// Contractor search and filtering
export interface ContractorSearchFilters {
  services?: ServiceType[];
  serviceAreas?: Province[];
  minRating?: number;
  minExperience?: number;
  isAvailable?: boolean;
  budgetRange?: {
    min?: number;
    max?: number;
  };
}

export interface ContractorSearchResult {
  contractors: IContractorWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}