import { BasePlatformService } from './base-service';
import { PlatformResponse, Review } from './types';
import { generateSampleResponse } from './sample-data';

export class GoogleService extends BasePlatformService {
  private apiKey: string;

  constructor(apiKey?: string) {
    super('google', apiKey);
    this.apiKey = apiKey || '';
  }

  async fetchReviews(
    businessId: string,
    limit: number = 20
  ): Promise<PlatformResponse> {
    try {
      if (!this.apiKey) {
        console.warn('Google API key not configured. Returning sample data.');
        return generateSampleResponse('google');
      }

      const url = `https://www.googleapis.com/mybusiness/v4/accounts/-/locations/${businessId}/reviews?pageSize=${limit}&key=${this.apiKey}`;

      const response = await this.makeRequest(url);
      const data = await response.json();

      const reviews = (data.reviews || []).map((review: any) => ({
        id: review.name.split('/').pop(),
        author: review.reviewer.displayName,
        content: review.comment || '',
        rating: review.starRating || 0,
        url: review.reviewReply?.updateTime ? `https://maps.google.com` : '',
        reviewedAt: new Date(review.createTime),
        platformName: 'google',
      }));

      return {
        reviews,
        totalCount: data.reviews?.length || 0,
        hasMore: !!data.nextPageToken,
        nextPageToken: data.nextPageToken,
      };
    } catch (error) {
      console.error('Google API error:', error);
      return generateSampleResponse('google');
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false;
      }

      const url = `https://www.googleapis.com/mybusiness/v4/accounts?key=${this.apiKey}`;
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}
