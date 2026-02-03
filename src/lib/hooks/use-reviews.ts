import { useQuery } from '@tanstack/react-query';
import { ReviewService, ReviewFilter } from '../api/review-service';

export const useReviews = (filter: ReviewFilter, limit: number = 50) => {
  return useQuery({
    queryKey: ['reviews', filter],
    queryFn: () => ReviewService.getReviews(filter, limit),
    enabled: !!filter.companyId,
  });
};

export const useReviewStats = (companyId: string) => {
  return useQuery({
    queryKey: ['review-stats', companyId],
    queryFn: () => ReviewService.getReviewStats(companyId),
    enabled: !!companyId,
  });
};

export const useSearchReviews = (companyId: string, keyword: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['reviews-search', companyId, keyword],
    queryFn: () => ReviewService.searchReviews(companyId, keyword, limit),
    enabled: !!companyId && keyword.length > 0,
  });
};

export const useRecentReviews = (companyId: string, days: number = 7) => {
  return useQuery({
    queryKey: ['recent-reviews', companyId, days],
    queryFn: () => ReviewService.getRecentReviews(companyId, days),
    enabled: !!companyId,
  });
};

export const useReviewsByPlatform = (companyId: string, platformName: string) => {
  return useQuery({
    queryKey: ['reviews-platform', companyId, platformName],
    queryFn: () => ReviewService.getReviewsByPlatform(companyId, platformName),
    enabled: !!companyId && !!platformName,
  });
};
