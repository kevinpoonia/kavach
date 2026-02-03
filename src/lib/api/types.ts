export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  url: string;
  reviewedAt: Date;
  platformName: string;
}

export interface PlatformResponse {
  reviews: Review[];
  totalCount: number;
  hasMore: boolean;
  nextPageToken?: string;
}

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  keywords: string[];
}

export interface NotificationPayload {
  companyId: string;
  platform: string;
  reviewCount: number;
  negativeCount: number;
  averageRating: number;
  recentReviews: Review[];
}

export interface SyncJobStatus {
  jobId: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  reviewsFetched: number;
  error?: string;
}
