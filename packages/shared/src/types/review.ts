// Review and rating-related types and interfaces

export interface IReview {
  id: string;
  jobId: string;
  customerId: string;
  rating: number; // 1-5 stars
  comment?: string;
  qualityRating?: number;
  timelinessRating?: number;
  communicationRating?: number;
  valueRating?: number;
  isApproved: boolean;
  moderatedAt?: Date;
  moderatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewWithDetails extends IReview {
  customer: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  job: {
    id: string;
    title: string;
    contractorId: string;
  };
}

// Review creation and update DTOs
export interface CreateReviewDto {
  jobId: string;
  customerId: string;
  rating: number;
  comment?: string;
  qualityRating?: number;
  timelinessRating?: number;
  communicationRating?: number;
  valueRating?: number;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  qualityRating?: number;
  timelinessRating?: number;
  communicationRating?: number;
  valueRating?: number;
}

export interface ModerateReviewDto {
  reviewId: string;
  approved: boolean;
  moderatorNotes?: string;
}

// Review aggregation and statistics
export interface ReviewStatistics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  averageQualityRating?: number;
  averageTimelinessRating?: number;
  averageCommunicationRating?: number;
  averageValueRating?: number;
}

export interface ContractorReviewSummary {
  contractorId: string;
  totalReviews: number;
  averageRating: number;
  recentReviews: IReviewWithDetails[];
  statistics: ReviewStatistics;
}

// Review search and filtering
export interface ReviewSearchFilters {
  contractorId?: string;
  customerId?: string;
  jobId?: string;
  rating?: number[];
  isApproved?: boolean;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface ReviewSearchResult {
  reviews: IReviewWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: ReviewStatistics;
}