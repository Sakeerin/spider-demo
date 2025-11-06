// Product and promotion-related types and interfaces

import { ProductCategory, ServiceType } from './common';

export interface IProduct {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  specifications: Record<string, any>;
  images: string[];
  priceMin?: number;
  priceMax?: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPromotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  serviceTypes: ServiceType[];
  discountType?: string;
  discountValue?: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  isFeatured: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product DTOs
export interface CreateProductDto {
  category: ProductCategory;
  name: string;
  description: string;
  specifications: Record<string, any>;
  images: string[];
  priceMin?: number;
  priceMax?: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}export 
interface UpdateProductDto {
  category?: ProductCategory;
  name?: string;
  description?: string;
  specifications?: Record<string, any>;
  images?: string[];
  priceMin?: number;
  priceMax?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

// Promotion DTOs
export interface CreatePromotionDto {
  title: string;
  description: string;
  image?: string;
  serviceTypes: ServiceType[];
  discountType?: string;
  discountValue?: number;
  validFrom: Date;
  validTo: Date;
  isActive?: boolean;
  isFeatured?: boolean;
  priority?: number;
}

export interface UpdatePromotionDto {
  title?: string;
  description?: string;
  image?: string;
  serviceTypes?: ServiceType[];
  discountType?: string;
  discountValue?: number;
  validFrom?: Date;
  validTo?: Date;
  isActive?: boolean;
  isFeatured?: boolean;
  priority?: number;
}

// Search and filtering
export interface ProductSearchFilters {
  category?: ProductCategory[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface PromotionSearchFilters {
  serviceTypes?: ServiceType[];
  isActive?: boolean;
  isFeatured?: boolean;
  validAt?: Date;
}