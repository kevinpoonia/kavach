import { supabase } from '../supabase-client';

export interface Review {
  id: string;
  company_id: string;
  platform_id?: string;
  platform_name: string;
  review_id: string;
  author: string;
  content: string;
  rating: number;
  sentiment?: string;
  url: string;
  reviewed_at: string;
  fetched_at: string;
  created_at: string;
}

export interface ReviewFilter {
  companyId: string;
  platformName?: string;
  sentiment?: string;
  startDate?: Date;
  endDate?: Date;
  minRating?: number;
  maxRating?: number;
}

export const ReviewService = {
  async getReviews(filter: ReviewFilter, limit: number = 50): Promise<Review[]> {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('company_id', filter.companyId);

    if (filter.platformName) {
      query = query.eq('platform_name', filter.platformName);
    }

    if (filter.sentiment) {
      query = query.eq('sentiment', filter.sentiment);
    }

    if (filter.startDate) {
      query = query.gte('reviewed_at', filter.startDate.toISOString());
    }

    if (filter.endDate) {
      query = query.lte('reviewed_at', filter.endDate.toISOString());
    }

    if (filter.minRating !== undefined) {
      query = query.gte('rating', filter.minRating);
    }

    if (filter.maxRating !== undefined) {
      query = query.lte('rating', filter.maxRating);
    }

    const { data, error } = await query
      .order('reviewed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getReviewStats(companyId: string) {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating, sentiment, platform_name')
      .eq('company_id', companyId);

    if (error) throw error;

    const stats = {
      totalReviews: reviews?.length || 0,
      averageRating: 0,
      sentimentBreakdown: {
        positive: 0,
        negative: 0,
        neutral: 0,
      },
      platformBreakdown: {} as Record<string, number>,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    if (!reviews || reviews.length === 0) {
      return stats;
    }

    let totalRating = 0;

    for (const review of reviews) {
      totalRating += review.rating;

      if (review.sentiment) {
        stats.sentimentBreakdown[review.sentiment as keyof typeof stats.sentimentBreakdown]++;
      }

      const platform = review.platform_name;
      stats.platformBreakdown[platform] = (stats.platformBreakdown[platform] || 0) + 1;

      const ratingBucket = Math.round(review.rating) as keyof typeof stats.ratingDistribution;
      if (ratingBucket >= 1 && ratingBucket <= 5) {
        stats.ratingDistribution[ratingBucket]++;
      }
    }

    stats.averageRating = totalRating / reviews.length;

    return stats;
  },

  async searchReviews(companyId: string, keyword: string, limit: number = 50): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', companyId)
      .or(`content.ilike.%${keyword}%,author.ilike.%${keyword}%`)
      .order('reviewed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getRecentReviews(companyId: string, days: number = 7): Promise<Review[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', companyId)
      .gte('reviewed_at', startDate.toISOString())
      .order('reviewed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getReviewsByPlatform(companyId: string, platformName: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', companyId)
      .eq('platform_name', platformName)
      .order('reviewed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
