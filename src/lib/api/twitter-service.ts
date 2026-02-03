import { BasePlatformService } from './base-service';
import { PlatformResponse, Review } from './types';
import { generateSampleResponse } from './sample-data';

export class TwitterService extends BasePlatformService {
  private bearerToken: string;

  constructor(bearerToken?: string) {
    super('twitter', bearerToken);
    this.bearerToken = bearerToken || '';
  }

  async fetchReviews(
    query: string,
    limit: number = 20
  ): Promise<PlatformResponse> {
    try {
      if (!this.bearerToken) {
        console.warn('Twitter API token not configured. Returning sample data.');
        return generateSampleResponse('twitter');
      }

      const searchUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${limit}&tweet.fields=created_at,author_id,public_metrics&expansions=author_id&user.fields=username`;

      const response = await this.makeRequest(searchUrl, {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
        },
      });

      const data = await response.json();
      const reviews = (data.data || []).map((tweet: any, index: number) => ({
        id: tweet.id,
        author: data.includes?.users?.[index]?.username || 'Unknown',
        content: tweet.text,
        rating: (tweet.public_metrics?.like_count || 0) / 10,
        url: `https://twitter.com/i/web/status/${tweet.id}`,
        reviewedAt: new Date(tweet.created_at),
        platformName: 'twitter',
      }));

      return {
        reviews,
        totalCount: data.meta?.result_count || 0,
        hasMore: !!data.meta?.next_token,
        nextPageToken: data.meta?.next_token,
      };
    } catch (error) {
      console.error('Twitter API error:', error);
      return generateSampleResponse('twitter');
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      if (!this.bearerToken) {
        return false;
      }

      const response = await this.makeRequest(
        'https://api.twitter.com/2/tweets/search/recent?query=test&max_results=10',
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
        }
      );

      return response.ok;
    } catch {
      return false;
    }
  }
}
