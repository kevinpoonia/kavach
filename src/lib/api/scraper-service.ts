import { BasePlatformService } from './base-service';
import { PlatformResponse, Review } from './types';
import { generateSampleResponse } from './sample-data';

export class ScraperService extends BasePlatformService {
  constructor(platformName: string) {
    super(platformName);
  }

  async fetchReviews(
    businessUrl: string,
    limit: number = 20
  ): Promise<PlatformResponse> {
    try {
      console.warn(
        `${this.platformName} requires web scraping. Returning sample data.`
      );
      return generateSampleResponse(this.platformName);
    } catch (error) {
      console.error(`${this.platformName} scraping error:`, error);
      return generateSampleResponse(this.platformName);
    }
  }

  async validateConnection(): Promise<boolean> {
    console.warn(`${this.platformName} validation not available. Returning false.`);
    return false;
  }
}

export class GlassdoorService extends ScraperService {
  constructor() {
    super('glassdoor');
  }
}

export class AmbitionBoxService extends ScraperService {
  constructor() {
    super('ambitionbox');
  }
}
