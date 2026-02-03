# Backend Implementation Guide - RepuPulse

## Overview

RepuPulse now has a complete backend system for fetching reviews from multiple platforms, analyzing sentiment, and sending automated notifications.

## Architecture

### Database Schema
- **companies** - Store business information
- **platforms** - Platform configurations (Reddit, Google, Twitter, Glassdoor, AmbitionBox)
- **reviews** - Aggregated reviews from all platforms with sentiment analysis
- **api_keys** - Encrypted storage of platform API credentials
- **notifications** - User notification preferences
- **notification_logs** - Track sent notifications
- **sync_jobs** - Monitor data fetch operations

All tables include Row Level Security (RLS) for multi-tenant data isolation.

### Edge Functions

#### fetch-reviews
- Triggered every 30 minutes via external scheduler
- Fetches reviews from all configured platforms
- Falls back to sample data if API keys are missing
- Records sync job status for monitoring

**Endpoint:** `POST /functions/v1/fetch-reviews`

#### send-notifications
- Triggered every 30 minutes after fetch-reviews
- Sends email, SMS, and WhatsApp notifications based on user settings
- Supports alert types: negative_review, rating_change, spike, all
- Logs all notification attempts

**Endpoint:** `POST /functions/v1/send-notifications`

## Platform Integration

### Supported Platforms

1. **Reddit** (Free API)
   - Requires: Client ID, Client Secret
   - Rate Limit: 60 requests/minute
   - Authentication: OAuth 2.0

2. **Google** (Free via My Business API)
   - Requires: API Key
   - Fetches reviews directly from Google My Business

3. **Twitter/X** (Free tier available)
   - Requires: Bearer Token
   - Uses Twitter API v2
   - Searches for mentions and reviews

4. **Glassdoor** (Web Scraping)
   - No official API available
   - Returns sample data
   - Can be enhanced with third-party scraping service

5. **AmbitionBox** (Web Scraping)
   - No official API available
   - Returns sample data
   - Can be enhanced with third-party scraping service

### AI Services

#### OpenAI (Paid - Pay as you go)
- Sentiment analysis and keyword extraction
- Response suggestions
- GPT-3.5 Turbo recommended (cost-effective)

#### Google Gemini (Free tier)
- Alternative to OpenAI
- 60 requests/minute free tier
- Sentiment analysis

## Configuration

### Environment Variables

```env
# Supabase (Auto-configured)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional API Keys
OPENAI_API_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
GOOGLE_MAPS_API_KEY=
TWITTER_BEARER_TOKEN=
```

### Setting Up API Keys

1. Go to Settings page
2. Navigate to "API Keys" section
3. Enter credentials for each platform
4. Keys are encrypted and stored in the database
5. Test connection to verify credentials

## Using the Backend Services

### Company Management

```typescript
import { CompanyService } from '@/lib/api/company-service';

// Create a company
const company = await CompanyService.createCompany({
  user_id: 'user-id',
  name: 'My Company',
  website: 'https://example.com',
  industry: 'Technology'
});

// Get company
const company = await CompanyService.getCompanyById(companyId);

// Add platform
const platform = await CompanyService.addPlatform({
  company_id: companyId,
  platform_name: 'google',
  business_id: 'google-business-id',
  is_active: true
});
```

### Review Management

```typescript
import { ReviewService } from '@/lib/api/review-service';

// Get reviews with filters
const reviews = await ReviewService.getReviews({
  companyId: 'company-id',
  platformName: 'google',
  sentiment: 'negative',
  startDate: new Date('2024-01-01')
});

// Get review statistics
const stats = await ReviewService.getReviewStats(companyId);
console.log(stats.averageRating);
console.log(stats.sentimentBreakdown);

// Search reviews
const results = await ReviewService.searchReviews(
  companyId,
  'keyword'
);
```

### Notification Management

```typescript
import { NotificationService } from '@/lib/api/notification-service';

// Add email notification
const config = await NotificationService.addNotificationConfig({
  company_id: companyId,
  notification_type: 'email',
  recipient: 'manager@company.com',
  alert_type: 'negative_review',
  is_active: true
});

// Test notification
const success = await NotificationService.testNotification(
  companyId,
  'email',
  'test@example.com'
);

// Get notification logs
const logs = await NotificationService.getNotificationLogs(companyId);
```

### Sync Job Monitoring

```typescript
import { SyncService } from '@/lib/api/sync-service';

// Get sync jobs for company
const jobs = await SyncService.getSyncJobs(companyId);

// Get statistics
const stats = await SyncService.getSyncStats(companyId);
console.log(stats.successfulJobs);
console.log(stats.totalReviewsFetched);

// Get success rate
const rate = await SyncService.getSuccessRate(companyId, 30);
```

## Frontend Hooks

All services have corresponding React Query hooks for easy integration:

```typescript
// Company hooks
import {
  useCompanies,
  useCreateCompany,
  usePlatforms,
  useFetchReviews
} from '@/lib/hooks/use-company';

// Review hooks
import {
  useReviews,
  useReviewStats,
  useRecentReviews
} from '@/lib/hooks/use-reviews';

// Notification hooks
import {
  useNotificationConfigs,
  useAddNotificationConfig,
  useTestNotification
} from '@/lib/hooks/use-notifications';

// Sync hooks
import {
  useSyncJobs,
  useSyncStats,
  useSyncSuccessRate
} from '@/lib/hooks/use-sync';
```

## Notification Channels

### Email (Resend)
- Free tier: 3,000 emails/month
- Unlimited paid tier
- Reliable and professional
- Setup: Get API key from [Resend](https://resend.com)

### SMS (Twilio)
- Pay as you go: $0.0075 per SMS
- 150+ countries supported
- Reliable delivery
- Setup: Get Account SID and Auth Token from [Twilio](https://www.twilio.com)

### WhatsApp (Twilio)
- Pay as you go: $0.005 per message
- Direct messaging to customers
- Higher engagement rates
- Requires WhatsApp Business Account

## Automated Scheduling

To set up automatic data fetching every 30 minutes, use one of these options:

### Option 1: External Cron Service (Recommended)
- Use [EasyCron](https://www.easycron.com/) (free tier available)
- Set up cron jobs to call the edge functions
- No infrastructure needed

### Option 2: GitHub Actions
```yaml
name: Fetch Reviews
on:
  schedule:
    - cron: '*/30 * * * *'
jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch Reviews
        run: curl -X POST https://your-supabase-url/functions/v1/fetch-reviews
```

### Option 3: Vercel Cron
If deploying on Vercel, use serverless functions with cron syntax.

## Monitoring and Analytics

### Review Dashboard
- Real-time review count by platform
- Sentiment distribution (positive/negative/neutral)
- Average rating trend
- Platform comparison

### Sync Status
- Last sync timestamp for each platform
- Reviews fetched in last sync
- Success/failure rate
- Error messages for failed syncs

### Notification Analytics
- Total notifications sent
- Success rate by channel
- Failed notification logs
- Response metrics

## Cost Estimates (Monthly)

| Service | Tier | Estimated Cost |
|---------|------|----------------|
| Supabase | Free | $0 |
| Resend (Email) | Free | $0 (up to 3,000) |
| Twilio (SMS) | Pay as you go | ~$1.50-5 (200 SMS) |
| OpenAI (Sentiment) | Pay as you go | ~$2-5 |
| Google Gemini | Free | $0 |
| Reddit API | Free | $0 |
| Google My Business | Free | $0 |
| Twitter API | Free | $0 (basic) |

**Total Estimated Cost:** $0-15/month with free tiers

## Troubleshooting

### Reviews Not Fetching
1. Check if platforms are marked as active
2. Verify API keys are configured correctly
3. Check sync job logs for errors
4. Ensure business IDs are correct for each platform

### Notifications Not Sending
1. Verify notification configurations exist
2. Test notification with `testNotification()` method
3. Check notification logs for delivery status
4. Ensure API keys for email/SMS are valid

### Sentiment Not Analyzing
1. Set up OpenAI or Gemini API keys
2. Check AI service configuration in environment
3. Verify API key has proper permissions
4. Check edge function logs for errors

## API Reference

### Core Endpoints

All endpoints require authentication with Supabase JWT token.

**Fetch Reviews Edge Function**
```
POST /functions/v1/fetch-reviews
Headers: Authorization: Bearer {token}
Response: { success: boolean, reviewsFetched: number }
```

**Send Notifications Edge Function**
```
POST /functions/v1/send-notifications
Headers: Authorization: Bearer {token}
Response: { success: boolean, companiesProcessed: number }
```

## Next Steps

1. Add API keys for desired platforms
2. Configure notification recipients
3. Set up automated scheduling
4. Monitor sync jobs and reviews
5. Customize notification rules
6. Integrate with customer support system

## Support

For issues or questions:
1. Check Supabase logs
2. Review edge function execution logs
3. Verify RLS policies allow access
4. Check database for data integrity
