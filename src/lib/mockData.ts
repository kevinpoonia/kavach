// Mock data for RepuPulse dashboard

export type Platform = 'google' | 'trustpilot' | 'glassdoor' | 'g2' | 'yelp' | 'reddit' | 'twitter';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type ReviewStatus = 'open' | 'responded' | 'escalated' | 'resolved';
export type UserRole = 'admin' | 'support' | 'hr' | 'legal' | 'marketing';

export interface Review {
  id: string;
  platform: Platform;
  author: string;
  avatar?: string;
  rating: number;
  content: string;
  sentiment: Sentiment;
  sentimentScore: number;
  date: string;
  product?: string;
  location?: string;
  language: string;
  topics: string[];
  status: ReviewStatus;
  assignedTo?: string;
  response?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface PlatformStats {
  platform: Platform;
  reviews: number;
  avgRating: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  reviewsHandled: number;
  avgResponseTime: string;
}

export interface Integration {
  id: string;
  name: string;
  category: 'reviews' | 'crm' | 'communication' | 'analytics';
  connected: boolean;
  icon: string;
}

export interface AlertItem {
  id: string;
  type: 'negative' | 'spike' | 'viral' | 'drop';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  category: string;
  tone: string;
  content: string;
}

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    platform: 'google',
    author: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    content: 'Absolutely fantastic experience! The customer service team went above and beyond to help resolve my issue. The product quality exceeded my expectations.',
    sentiment: 'positive',
    sentimentScore: 0.92,
    date: '2024-01-15',
    product: 'Pro Plan',
    location: 'New York, USA',
    language: 'en',
    topics: ['customer service', 'product quality'],
    status: 'responded',
    response: 'Thank you for your wonderful feedback, Sarah!'
  },
  {
    id: '2',
    platform: 'trustpilot',
    author: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    rating: 4,
    content: 'Great product overall. The onboarding was smooth and the features are robust. Would love to see more integrations in the future.',
    sentiment: 'positive',
    sentimentScore: 0.78,
    date: '2024-01-14',
    product: 'Enterprise',
    location: 'San Francisco, USA',
    language: 'en',
    topics: ['onboarding', 'features', 'integrations'],
    status: 'open'
  },
  {
    id: '3',
    platform: 'g2',
    author: 'Emma Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    rating: 2,
    content: 'Had some issues with the billing system. Support took too long to respond and the problem is still not fully resolved. Frustrated with the experience.',
    sentiment: 'negative',
    sentimentScore: 0.23,
    date: '2024-01-14',
    product: 'Starter',
    location: 'London, UK',
    language: 'en',
    topics: ['billing', 'support', 'response time'],
    status: 'escalated',
    assignedTo: 'Support Team'
  },
  {
    id: '4',
    platform: 'glassdoor',
    author: 'James Miller',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    rating: 4,
    content: 'Great work culture and amazing team. Leadership is transparent and supportive. Some room for improvement in career growth opportunities.',
    sentiment: 'positive',
    sentimentScore: 0.81,
    date: '2024-01-13',
    language: 'en',
    topics: ['work culture', 'leadership', 'career growth'],
    status: 'open'
  },
  {
    id: '5',
    platform: 'reddit',
    author: 'TechEnthusiast42',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    rating: 3,
    content: 'Decent product but the pricing is a bit steep compared to competitors. The features are good but not unique enough to justify the premium.',
    sentiment: 'neutral',
    sentimentScore: 0.52,
    date: '2024-01-12',
    language: 'en',
    topics: ['pricing', 'competition', 'features'],
    status: 'open'
  },
  {
    id: '6',
    platform: 'twitter',
    author: '@StartupFounder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Founder',
    rating: 5,
    content: 'Just switched to @RepuPulse and wow! The AI insights are game-changing. Finally a tool that understands what matters for reputation management. 🚀',
    sentiment: 'positive',
    sentimentScore: 0.95,
    date: '2024-01-12',
    language: 'en',
    topics: ['AI', 'reputation management'],
    status: 'responded'
  },
  {
    id: '7',
    platform: 'yelp',
    author: 'David Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 1,
    content: 'Terrible experience. The product crashed multiple times and lost my data. Customer support was unhelpful and dismissive. Would not recommend.',
    sentiment: 'negative',
    sentimentScore: 0.08,
    date: '2024-01-11',
    location: 'Chicago, USA',
    language: 'en',
    topics: ['bugs', 'data loss', 'support'],
    status: 'escalated',
    assignedTo: 'Legal Team'
  },
  {
    id: '8',
    platform: 'google',
    author: 'Lisa Anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    rating: 4,
    content: 'Very intuitive interface and helpful documentation. The team is responsive and continuously improving the product. Looking forward to new features!',
    sentiment: 'positive',
    sentimentScore: 0.85,
    date: '2024-01-10',
    product: 'Pro Plan',
    location: 'Austin, USA',
    language: 'en',
    topics: ['UI/UX', 'documentation', 'updates'],
    status: 'resolved'
  },
];

// Dashboard Metrics
export const dashboardMetrics: MetricCard[] = [
  { title: 'Reputation Score', value: 87, change: 3.2, changeLabel: 'vs last month', icon: 'trophy' },
  { title: 'Total Reviews', value: '2,847', change: 12.5, changeLabel: 'vs last month', icon: 'message-square' },
  { title: 'Avg Response Time', value: '2.4h', change: -18.3, changeLabel: 'vs last month', icon: 'clock' },
  { title: 'Resolution Rate', value: '94%', change: 5.1, changeLabel: 'vs last month', icon: 'check-circle' },
];

// Platform Statistics
export const platformStats: PlatformStats[] = [
  { platform: 'google', reviews: 892, avgRating: 4.3, sentiment: { positive: 72, neutral: 18, negative: 10 } },
  { platform: 'trustpilot', reviews: 654, avgRating: 4.5, sentiment: { positive: 78, neutral: 15, negative: 7 } },
  { platform: 'glassdoor', reviews: 234, avgRating: 4.1, sentiment: { positive: 65, neutral: 22, negative: 13 } },
  { platform: 'g2', reviews: 445, avgRating: 4.4, sentiment: { positive: 75, neutral: 17, negative: 8 } },
  { platform: 'yelp', reviews: 312, avgRating: 3.9, sentiment: { positive: 58, neutral: 24, negative: 18 } },
  { platform: 'reddit', reviews: 187, avgRating: 3.8, sentiment: { positive: 52, neutral: 30, negative: 18 } },
  { platform: 'twitter', reviews: 123, avgRating: 4.2, sentiment: { positive: 68, neutral: 22, negative: 10 } },
];

// Team Members
export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Thompson', email: 'alex@repupulse.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', reviewsHandled: 342, avgResponseTime: '1.8h' },
  { id: '2', name: 'Maria Garcia', email: 'maria@repupulse.com', role: 'support', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', reviewsHandled: 528, avgResponseTime: '2.1h' },
  { id: '3', name: 'John Smith', email: 'john@repupulse.com', role: 'support', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', reviewsHandled: 415, avgResponseTime: '2.4h' },
  { id: '4', name: 'Emily Davis', email: 'emily@repupulse.com', role: 'hr', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', reviewsHandled: 156, avgResponseTime: '3.2h' },
  { id: '5', name: 'Robert Wilson', email: 'robert@repupulse.com', role: 'legal', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', reviewsHandled: 89, avgResponseTime: '4.5h' },
  { id: '6', name: 'Sophie Martin', email: 'sophie@repupulse.com', role: 'marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', reviewsHandled: 203, avgResponseTime: '2.8h' },
];

// Integrations
export const integrations: Integration[] = [
  { id: '1', name: 'Google Reviews', category: 'reviews', connected: true, icon: 'google' },
  { id: '2', name: 'Trustpilot', category: 'reviews', connected: true, icon: 'star' },
  { id: '3', name: 'Glassdoor', category: 'reviews', connected: true, icon: 'building' },
  { id: '4', name: 'G2', category: 'reviews', connected: false, icon: 'grid' },
  { id: '5', name: 'Yelp', category: 'reviews', connected: true, icon: 'map-pin' },
  { id: '6', name: 'Reddit', category: 'reviews', connected: false, icon: 'message-circle' },
  { id: '7', name: 'Twitter/X', category: 'reviews', connected: true, icon: 'twitter' },
  { id: '8', name: 'Zendesk', category: 'crm', connected: true, icon: 'headphones' },
  { id: '9', name: 'Freshdesk', category: 'crm', connected: false, icon: 'inbox' },
  { id: '10', name: 'HubSpot', category: 'crm', connected: true, icon: 'hub' },
  { id: '11', name: 'Salesforce', category: 'crm', connected: false, icon: 'cloud' },
  { id: '12', name: 'Slack', category: 'communication', connected: true, icon: 'slack' },
  { id: '13', name: 'WhatsApp', category: 'communication', connected: false, icon: 'phone' },
  { id: '14', name: 'Email (SendGrid)', category: 'communication', connected: true, icon: 'mail' },
];

// Alerts
export const alerts: AlertItem[] = [
  { id: '1', type: 'negative', title: 'Critical Review Alert', description: '1-star review detected on Yelp requiring immediate attention', time: '10 min ago', read: false },
  { id: '2', type: 'spike', title: 'Review Volume Spike', description: 'Unusual increase in Google Reviews (45% above normal)', time: '1 hour ago', read: false },
  { id: '3', type: 'viral', title: 'Viral Mention Detected', description: 'Your brand is trending on Twitter with 2.5K mentions', time: '2 hours ago', read: true },
  { id: '4', type: 'drop', title: 'Reputation Score Drop', description: 'Overall score decreased by 5 points in the last 24 hours', time: '5 hours ago', read: true },
];

// Response Templates
export const responseTemplates: ResponseTemplate[] = [
  { id: '1', name: 'Thank You - Positive', category: 'appreciation', tone: 'friendly', content: 'Thank you so much for taking the time to share your positive experience! We\'re thrilled to hear that {specific_praise}. Your feedback motivates our team to continue delivering excellence.' },
  { id: '2', name: 'Apology - Service Issue', category: 'apology', tone: 'apologetic', content: 'We sincerely apologize for the inconvenience you experienced with {issue}. This is not the standard we strive for. We would like to make this right - please contact us at {contact} so we can resolve this immediately.' },
  { id: '3', name: 'Professional - Neutral', category: 'general', tone: 'professional', content: 'Thank you for your feedback. We appreciate you sharing your experience with us. We value your input and will use it to improve our services.' },
  { id: '4', name: 'Follow-up Request', category: 'engagement', tone: 'supportive', content: 'Thank you for your review! We\'d love to hear more about your experience. Would you be open to a brief conversation to help us understand how we can serve you better?' },
  { id: '5', name: 'Legal - Defamation', category: 'legal', tone: 'legal-safe', content: 'We take all feedback seriously. However, we must respectfully note that some statements in this review may not accurately reflect the facts. We invite you to contact our team directly to discuss your concerns.' },
];

// Chart Data
export const sentimentTrendData = [
  { month: 'Jul', positive: 65, neutral: 22, negative: 13 },
  { month: 'Aug', positive: 68, neutral: 20, negative: 12 },
  { month: 'Sep', positive: 72, neutral: 18, negative: 10 },
  { month: 'Oct', positive: 70, neutral: 19, negative: 11 },
  { month: 'Nov', positive: 75, neutral: 17, negative: 8 },
  { month: 'Dec', positive: 78, neutral: 15, negative: 7 },
  { month: 'Jan', positive: 80, neutral: 14, negative: 6 },
];

export const reviewVolumeData = [
  { month: 'Jul', google: 120, trustpilot: 85, g2: 45, glassdoor: 30, yelp: 40, other: 25 },
  { month: 'Aug', google: 135, trustpilot: 92, g2: 52, glassdoor: 28, yelp: 38, other: 30 },
  { month: 'Sep', google: 148, trustpilot: 98, g2: 58, glassdoor: 35, yelp: 42, other: 28 },
  { month: 'Oct', google: 142, trustpilot: 88, g2: 55, glassdoor: 32, yelp: 45, other: 32 },
  { month: 'Nov', google: 165, trustpilot: 105, g2: 62, glassdoor: 38, yelp: 48, other: 35 },
  { month: 'Dec', google: 178, trustpilot: 112, g2: 68, glassdoor: 42, yelp: 52, other: 38 },
  { month: 'Jan', google: 195, trustpilot: 125, g2: 75, glassdoor: 45, yelp: 55, other: 42 },
];

export const topKeywords = [
  { word: 'customer service', count: 342, sentiment: 'positive' as Sentiment },
  { word: 'product quality', count: 287, sentiment: 'positive' as Sentiment },
  { word: 'pricing', count: 234, sentiment: 'neutral' as Sentiment },
  { word: 'support', count: 198, sentiment: 'positive' as Sentiment },
  { word: 'delivery', count: 176, sentiment: 'positive' as Sentiment },
  { word: 'bugs', count: 145, sentiment: 'negative' as Sentiment },
  { word: 'features', count: 132, sentiment: 'positive' as Sentiment },
  { word: 'onboarding', count: 118, sentiment: 'positive' as Sentiment },
  { word: 'billing', count: 98, sentiment: 'negative' as Sentiment },
  { word: 'integrations', count: 87, sentiment: 'neutral' as Sentiment },
];

export const competitorData = [
  { name: 'Your Brand', score: 87, reviews: 2847, trend: 3.2 },
  { name: 'Competitor A', score: 82, reviews: 3245, trend: -1.5 },
  { name: 'Competitor B', score: 79, reviews: 2156, trend: 2.1 },
  { name: 'Competitor C', score: 85, reviews: 4521, trend: 0.8 },
];
