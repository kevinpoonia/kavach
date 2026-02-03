import React from 'react';
import { platformStats, Platform } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

const platformLabels: Record<Platform, string> = {
  google: 'Google',
  trustpilot: 'Trustpilot',
  glassdoor: 'Glassdoor',
  g2: 'G2',
  yelp: 'Ambition Box',
  reddit: 'Reddit',
  twitter: 'Twitter/X',
};

const platformColors: Record<Platform, string> = {
  google: 'bg-platform-google',
  trustpilot: 'bg-platform-trustpilot',
  glassdoor: 'bg-platform-glassdoor',
  g2: 'bg-platform-g2',
  yelp: 'bg-platform-yelp',
  reddit: 'bg-platform-reddit',
  twitter: 'bg-platform-twitter',
};

export function PlatformStats() {
  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Platform Performance</h3>
      <div className="space-y-4">
        {platformStats.map((stat) => (
          <div key={stat.platform} className="flex items-center gap-4">
            <div className={cn('w-2 h-10 rounded-full', platformColors[stat.platform])} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-foreground">{platformLabels[stat.platform]}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="font-semibold text-foreground">{stat.avgRating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-success transition-all"
                    style={{ width: `${stat.sentiment.positive}%` }}
                  />
                  <div
                    className="h-full bg-warning transition-all"
                    style={{ width: `${stat.sentiment.neutral}%` }}
                  />
                  <div
                    className="h-full bg-destructive transition-all"
                    style={{ width: `${stat.sentiment.negative}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">
                  {stat.reviews} reviews
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
