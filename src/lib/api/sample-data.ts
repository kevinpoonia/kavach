import { PlatformResponse, Review } from './types';

const sampleReviews = {
  positive: [
    'Great product! Exceeded my expectations.',
    'Excellent customer service and quality.',
    'Highly recommended. Very satisfied with my purchase.',
    'Best company in the industry. Keep it up!',
    'Outstanding experience from start to finish.',
    'Amazing service and great value for money.',
  ],
  negative: [
    'Poor customer support. Very disappointed.',
    'Product quality is not as advertised.',
    'Had issues with delivery and refund process.',
    'Waste of money. Would not recommend.',
    'Terrible experience. Avoid at all costs.',
    'False advertising. Did not meet expectations.',
  ],
  neutral: [
    'Product is okay. Nothing special.',
    'Average quality for the price.',
    'Met expectations but could be better.',
    'Decent service, room for improvement.',
    'It works as described. Fair value.',
    'Neither great nor terrible. Just okay.',
  ],
};

const sampleAuthors = [
  'John D.',
  'Sarah M.',
  'Michael P.',
  'Emma L.',
  'David R.',
  'Lisa K.',
  'James W.',
  'Rachel G.',
  'Tom H.',
  'Angela B.',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSampleReviews(
  platformName: string,
  count: number = 20
): Review[] {
  const reviews: Review[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const sentimentType = Math.random() > 0.3 ? (Math.random() > 0.5 ? 'positive' : 'negative') : 'neutral';
    const reviewType = sentimentType as keyof typeof sampleReviews;
    const rating =
      sentimentType === 'positive'
        ? Math.floor(Math.random() * 2) + 4
        : sentimentType === 'negative'
          ? Math.floor(Math.random() * 2) + 1
          : 3;

    reviews.push({
      id: `sample-${platformName}-${Date.now()}-${i}`,
      author: getRandomItem(sampleAuthors),
      content: getRandomItem(sampleReviews[reviewType]),
      rating,
      url: `https://${platformName}.example.com/review/${i}`,
      reviewedAt: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000),
      platformName,
    });
  }

  return reviews;
}

export function generateSampleResponse(
  platformName: string
): PlatformResponse {
  const reviews = generateSampleReviews(platformName);

  return {
    reviews,
    totalCount: reviews.length,
    hasMore: false,
  };
}
