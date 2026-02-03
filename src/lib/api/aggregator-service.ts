import { RedditService } from './reddit-service';
import { GoogleService } from './google-service';
import { TwitterService } from './twitter-service';
import { GlassdoorService, AmbitionBoxService } from './scraper-service';
import { AIService } from './ai-service';
import { Review, SentimentResult } from './types';

interface PlatformConfig {
  name: string;
  businessId: string;
  apiKey?: string;
  isActive: boolean;
}

interface AggregatedReviews {
  platform: string;
  reviews: (Review & { sentiment?: SentimentResult })[];
  totalCount: number;
  averageRating: number;
}

export class ReviewAggregatorService {
  private redditService: RedditService;
  private googleService: GoogleService;
  private twitterService: TwitterService;
  private glassdoorService: GlassdoorService;
  private ambitionBoxService: AmbitionBoxService;
  private aiService: AIService;

  constructor(
    redditKeys?: { clientId: string; clientSecret: string },
    googleApiKey?: string,
    twitterToken?: string,
    openaiKey?: string,
    geminiKey?: string
  ) {
    this.redditService = new RedditService(
      redditKeys?.clientId,
      redditKeys?.clientSecret
    );
    this.googleService = new GoogleService(googleApiKey);
    this.twitterService = new TwitterService(twitterToken);
    this.glassdoorService = new GlassdoorService();
    this.ambitionBoxService = new AmbitionBoxService();
    this.aiService = new AIService(openaiKey, geminiKey);
  }

  async fetchAllPlatforms(
    platforms: PlatformConfig[],
    analyzeSentiment: boolean = true
  ): Promise<AggregatedReviews[]> {
    const results: AggregatedReviews[] = [];

    for (const platform of platforms) {
      if (!platform.isActive) continue;

      try {
        let reviews = await this.fetchPlatform(platform.name, platform.businessId);

        if (analyzeSentiment) {
          for (const review of reviews) {
            const sentiment = await this.aiService.analyzeSentiment(
              review.content
            );
            (review as any).sentiment = sentiment;
          }
        }

        const aggregated: AggregatedReviews = {
          platform: platform.name,
          reviews,
          totalCount: reviews.length,
          averageRating:
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0,
        };

        results.push(aggregated);
      } catch (error) {
        console.error(`Error fetching from ${platform.name}:`, error);
      }
    }

    return results;
  }

  async fetchPlatform(platformName: string, businessId: string): Promise<Review[]> {
    switch (platformName.toLowerCase()) {
      case 'reddit':
        return (await this.redditService.fetchReviews(businessId)).reviews;
      case 'google':
        return (await this.googleService.fetchReviews(businessId)).reviews;
      case 'twitter':
        return (await this.twitterService.fetchReviews(businessId)).reviews;
      case 'glassdoor':
        return (await this.glassdoorService.fetchReviews(businessId)).reviews;
      case 'ambitionbox':
        return (await this.ambitionBoxService.fetchReviews(businessId)).reviews;
      default:
        console.warn(`Platform ${platformName} not supported`);
        return [];
    }
  }

  async validateAllConnections(
    platforms: PlatformConfig[]
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const platform of platforms) {
      try {
        switch (platform.name.toLowerCase()) {
          case 'reddit':
            results[platform.name] = await this.redditService.validateConnection();
            break;
          case 'google':
            results[platform.name] = await this.googleService.validateConnection();
            break;
          case 'twitter':
            results[platform.name] = await this.twitterService.validateConnection();
            break;
          case 'glassdoor':
            results[platform.name] = await this.glassdoorService.validateConnection();
            break;
          case 'ambitionbox':
            results[platform.name] =
              await this.ambitionBoxService.validateConnection();
            break;
          default:
            results[platform.name] = false;
        }
      } catch {
        results[platform.name] = false;
      }
    }

    return results;
  }
}
