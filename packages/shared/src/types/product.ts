// Product-related types and interfaces

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
