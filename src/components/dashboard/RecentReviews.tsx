import React from 'react';
import { mockReviews, Platform, Sentiment } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const platformLabels: Record<Platform, string> = {
  google: 'Google',
  trustpilot: 'Trustpilot',
  glassdoor: 'Glassdoor',
  g2: 'G2',
  yelp: 'Yelp',
  reddit: 'Reddit',
  twitter: 'Twitter/X',
};

const sentimentColors: Record<Sentiment, string> = {
  positive: 'bg-success/10 text-success border-success/20',
  neutral: 'bg-warning/10 text-warning border-warning/20',
  negative: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function RecentReviews() {
  const recentReviews = mockReviews.slice(0, 5);

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Reviews</h3>
        <Link 
          to="/reviews" 
          className="text-sm font-medium text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
        >
          View All
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="space-y-4">
        {recentReviews.map((review) => (
          <div key={review.id} className="flex gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <img
              src={review.avatar}
              alt={review.author}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground truncate">{review.author}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{platformLabels[review.platform]}</span>
                <span className={cn(
                  'ml-auto px-2 py-0.5 rounded-full text-xs font-medium border',
                  sentimentColors[review.sentiment]
                )}>
                  {review.sentiment}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3.5 h-3.5',
                      i < review.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'
                    )}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
