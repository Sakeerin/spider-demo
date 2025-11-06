import { Prisma } from '@prisma/client';

/**
 * Utility functions for database operations
 */
export class DatabaseUtils {
  /**
   * Create pagination parameters for Prisma queries
   */
  static createPaginationParams(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return {
      skip,
      take: limit,
    };
  }

  /**
   * Create pagination metadata
   */
  static createPaginationMeta(
    total: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Create search filter for text fields
   */
  static createTextSearchFilter(
    query: string,
    fields: string[],
  ): Prisma.StringFilter {
    if (!query || !fields.length) {
      return undefined;
    }

    return {
      contains: query,
      mode: 'insensitive',
    };
  }

  /**
   * Create date range filter
   */
  static createDateRangeFilter(
    from?: Date,
    to?: Date,
  ): Prisma.DateTimeFilter | undefined {
    if (!from && !to) {
      return undefined;
    }

    const filter: Prisma.DateTimeFilter = {};

    if (from) {
      filter.gte = from;
    }

    if (to) {
      filter.lte = to;
    }

    return filter;
  }

  /**
   * Create number range filter
   */
  static createNumberRangeFilter(
    min?: number,
    max?: number,
  ): Prisma.FloatFilter | undefined {
    if (min === undefined && max === undefined) {
      return undefined;
    }

    const filter: Prisma.FloatFilter = {};

    if (min !== undefined) {
      filter.gte = min;
    }

    if (max !== undefined) {
      filter.lte = max;
    }

    return filter;
  }

  /**
   * Create array contains filter
   */
  static createArrayContainsFilter<T>(
    values: T[],
  ): { hasSome: T[] } | undefined {
    if (!values || values.length === 0) {
      return undefined;
    }

    return {
      hasSome: values,
    };
  }

  /**
   * Create order by clause from sort parameters
   */
  static createOrderBy(
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Record<string, 'asc' | 'desc'> | undefined {
    if (!sortBy) {
      return undefined;
    }

    return {
      [sortBy]: sortOrder,
    };
  }

  /**
   * Safely execute a database operation with error handling
   */
  static async safeExecute<T>(
    operation: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const contextMessage = context ? ` in ${context}` : '';
      throw new Error(`Database operation failed${contextMessage}: ${error.message}`);
    }
  }

  /**
   * Check if a record exists by ID
   */
  static async recordExists(
    model: any,
    id: string,
  ): Promise<boolean> {
    try {
      const record = await model.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!record;
    } catch {
      return false;
    }
  }

  /**
   * Get record count with filters
   */
  static async getCount(
    model: any,
    where?: any,
  ): Promise<number> {
    return model.count({ where });
  }

  /**
   * Batch update records
   */
  static async batchUpdate(
    model: any,
    updates: Array<{ where: any; data: any }>,
  ): Promise<number> {
    let updatedCount = 0;

    for (const update of updates) {
      try {
        await model.update(update);
        updatedCount++;
      } catch (error) {
        // Log error but continue with other updates
        console.error('Batch update failed for record:', update.where, error);
      }
    }

    return updatedCount;
  }

  /**
   * Create unique slug from text
   */
  static createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Ensure unique slug by appending number if needed
   */
  static async ensureUniqueSlug(
    model: any,
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await model.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || (excludeId && existing.id === excludeId)) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
}