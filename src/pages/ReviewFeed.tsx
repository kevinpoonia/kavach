import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { mockReviews, Platform, Sentiment, ReviewStatus } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { 
  Star, 
  Filter, 
  Search, 
  MessageCircle, 
  Globe, 
  ThumbsUp, 
  ThumbsDown, 
  Minus,
  ChevronDown,
  Reply,
  Flag,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const platformLabels: Record<Platform, string> = {
  google: 'Google',
  trustpilot: 'Trustpilot',
  glassdoor: 'Glassdoor',
  g2: 'G2',
  yelp: 'Yelp',
  reddit: 'Reddit',
  twitter: 'Twitter/X',
};

const sentimentIcons: Record<Sentiment, React.ElementType> = {
  positive: ThumbsUp,
  neutral: Minus,
  negative: ThumbsDown,
};

const sentimentColors: Record<Sentiment, string> = {
  positive: 'text-success bg-success/10 border-success/20',
  neutral: 'text-warning bg-warning/10 border-warning/20',
  negative: 'text-destructive bg-destructive/10 border-destructive/20',
};

const statusColors: Record<ReviewStatus, string> = {
  open: 'bg-info/10 text-info',
  responded: 'bg-success/10 text-success',
  escalated: 'bg-warning/10 text-warning',
  resolved: 'bg-muted text-muted-foreground',
};

export default function ReviewFeed() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const filteredReviews = mockReviews.filter(review => {
    if (selectedPlatform !== 'all' && review.platform !== selectedPlatform) return false;
    if (selectedSentiment !== 'all' && review.sentiment !== selectedSentiment) return false;
    if (searchQuery && !review.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <MainLayout>
      <Header 
        title="Review Feed" 
        subtitle="Monitor and manage reviews across all platforms"
      />
      <div className="p-6 animate-fade-in">
        {/* Filters */}
        <div className="card-elevated p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search w-full pl-10"
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'all')}
                className="input-search appearance-none pr-10 cursor-pointer"
              >
                <option value="all">All Platforms</option>
                {Object.entries(platformLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Sentiment Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSentiment('all')}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedSentiment === 'all' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                All
              </button>
              {(['positive', 'neutral', 'negative'] as Sentiment[]).map((sentiment) => {
                const Icon = sentimentIcons[sentiment];
                return (
                  <button
                    key={sentiment}
                    onClick={() => setSelectedSentiment(sentiment)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      selectedSentiment === sentiment 
                        ? sentimentColors[sentiment] 
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{sentiment}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Reviews */}
          <div className="xl:col-span-2 space-y-4">
            {filteredReviews.map((review) => {
              const SentimentIcon = sentimentIcons[review.sentiment];
              const isSelected = selectedReview === review.id;
              
              return (
                <div
                  key={review.id}
                  onClick={() => setSelectedReview(review.id)}
                  className={cn(
                    'card-elevated p-5 cursor-pointer transition-all',
                    isSelected && 'ring-2 ring-accent'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className="font-semibold text-foreground">{review.author}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{platformLabels[review.platform]}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                        
                        <div className="ml-auto flex items-center gap-2">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            statusColors[review.status]
                          )}>
                            {review.status}
                          </span>
                          <span className={cn(
                            'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                            sentimentColors[review.sentiment]
                          )}>
                            <SentimentIcon className="w-3 h-3" />
                            {Math.round(review.sentimentScore * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-4 h-4',
                              i < review.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                        {review.product && (
                          <span className="ml-3 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {review.product}
                          </span>
                        )}
                        {review.location && (
                          <span className="flex items-center gap-1 ml-2 text-xs text-muted-foreground">
                            <Globe className="w-3 h-3" />
                            {review.location}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-foreground leading-relaxed mb-3">{review.content}</p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {review.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 rounded-md text-xs bg-secondary text-muted-foreground"
                          >
                            #{topic.replace(' ', '-')}
                          </span>
                        ))}
                      </div>

                      {/* Response */}
                      {review.response && (
                        <div className="mt-4 p-3 rounded-lg bg-accent/5 border-l-2 border-accent">
                          <div className="flex items-center gap-2 mb-1">
                            <Reply className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">Your Response</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="hidden xl:block">
            <div className="card-elevated p-6 sticky top-24">
              {selectedReview ? (
                <>
                  {(() => {
                    const review = mockReviews.find(r => r.id === selectedReview)!;
                    return (
                      <>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <Button className="w-full btn-gradient justify-center gap-2">
                            <Reply className="w-4 h-4" />
                            Respond to Review
                          </Button>
                          <Button variant="outline" className="w-full gap-2">
                            <User className="w-4 h-4" />
                            Assign to Team Member
                          </Button>
                          <Button variant="outline" className="w-full gap-2">
                            <Flag className="w-4 h-4" />
                            Escalate Issue
                          </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                          <h4 className="text-sm font-semibold text-foreground mb-3">AI Suggested Response</h4>
                          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                            <p className="text-sm text-muted-foreground">
                              {review.sentiment === 'positive' 
                                ? "Thank you so much for your wonderful feedback! We're thrilled to hear about your positive experience."
                                : review.sentiment === 'negative'
                                ? "We sincerely apologize for your experience. Your feedback is important to us, and we'd like to make things right."
                                : "Thank you for taking the time to share your thoughts. We appreciate your feedback and will use it to improve."}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="mt-2 text-accent">
                            Use this response
                          </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                          <h4 className="text-sm font-semibold text-foreground mb-3">Review Insights</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Sentiment Score</span>
                              <span className="font-medium text-foreground">{Math.round(review.sentimentScore * 100)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Language</span>
                              <span className="font-medium text-foreground">{review.language.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status</span>
                              <span className="font-medium text-foreground capitalize">{review.status}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Select a review to see details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
