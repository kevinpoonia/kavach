import { PlatformResponse, Review } from './types';

export abstract class BasePlatformService {
  protected platformName: string;
  protected apiKey?: string;

  constructor(platformName: string, apiKey?: string) {
    this.platformName = platformName;
    this.apiKey = apiKey;
  }

  abstract fetchReviews(businessId: string, limit?: number): Promise<PlatformResponse>;

  abstract validateConnection(): Promise<boolean>;

  protected async makeRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `${this.platformName} API error: ${response.status} ${response.statusText}`
      );
    }

    return response;
  }

  protected normalizeDateString(dateStr: string | Date): Date {
    return typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  }
}
