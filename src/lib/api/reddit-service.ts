import { BasePlatformService } from './base-service';
import { PlatformResponse, Review } from './types';
import { generateSampleResponse } from './sample-data';

export class RedditService extends BasePlatformService {
  private clientId: string;
  private clientSecret: string;
  private userAgent: string = 'ReviewAggregator/1.0';

  constructor(clientId?: string, clientSecret?: string) {
    super('reddit', clientId);
    this.clientId = clientId || '';
    this.clientSecret = clientSecret || '';
  }

  async fetchReviews(subreddit: string, limit: number = 20): Promise<PlatformResponse> {
    try {
      if (!this.clientId || !this.clientSecret) {
        console.warn('Reddit API credentials not configured. Returning sample data.');
        return generateSampleResponse('reddit');
      }

      const token = await this.getAccessToken();
      const url = `https://oauth.reddit.com/r/${subreddit}/new?limit=${limit}`;

      const response = await this.makeRequest(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': this.userAgent,
        },
      });

      const data = await response.json();
      const reviews = this.parseRedditPosts(data.data.children);

      return {
        reviews,
        totalCount: reviews.length,
        hasMore: !!data.data.after,
        nextPageToken: data.data.after || undefined,
      };
    } catch (error) {
      console.error('Reddit API error:', error);
      return generateSampleResponse('reddit');
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      if (!this.clientId || !this.clientSecret) {
        return false;
      }

      await this.getAccessToken();
      return true;
    } catch {
      return false;
    }
  }

  private async getAccessToken(): Promise<string> {
    const auth = btoa(`${this.clientId}:${this.clientSecret}`);
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'User-Agent': this.userAgent,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get Reddit access token');
    }

    const data = await response.json();
    return data.access_token;
  }

  private parseRedditPosts(posts: any[]): Review[] {
    return posts.map((post) => ({
      id: post.data.id,
      author: post.data.author || 'Anonymous',
      content: post.data.title + '\n' + (post.data.selftext || ''),
      rating: post.data.score / 100,
      url: `https://reddit.com${post.data.permalink}`,
      reviewedAt: new Date(post.data.created_utc * 1000),
      platformName: 'reddit',
    }));
  }
}
