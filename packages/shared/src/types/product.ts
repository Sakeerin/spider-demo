// Product and promotion types

import { ProductCategory } from './common';

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
  serviceTypes: string[];
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
