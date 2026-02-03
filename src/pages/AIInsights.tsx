import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { topKeywords, competitorData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function AIInsights() {
  const overallSentiment = { positive: 75, neutral: 17, negative: 8 };

  return (
    <MainLayout>
      <Header 
        title="AI Insights" 
        subtitle="AI-powered analysis of your reputation data"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* AI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Positive Trend</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">+12.5%</p>
            <p className="text-sm text-muted-foreground">Customer satisfaction is improving</p>
          </div>

          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-warning/10">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Risk Alert</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">3</p>
            <p className="text-sm text-muted-foreground">Issues requiring attention</p>
          </div>

          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Lightbulb className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Opportunities</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">7</p>
            <p className="text-sm text-muted-foreground">Improvement suggestions</p>
          </div>

          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-info/10">
                <Target className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Focus Areas</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">4</p>
            <p className="text-sm text-muted-foreground">Topics trending negatively</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyword Cloud */}
          <div className="lg:col-span-2 card-elevated p-6">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Topic Analysis</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {topKeywords.map((keyword, index) => {
                const size = Math.max(0.8, 1.4 - index * 0.08);
                return (
                  <span
                    key={keyword.word}
                    className={cn(
                      'px-4 py-2 rounded-full font-medium transition-all hover:scale-105 cursor-pointer',
                      keyword.sentiment === 'positive' && 'bg-success/10 text-success hover:bg-success/20',
                      keyword.sentiment === 'neutral' && 'bg-warning/10 text-warning hover:bg-warning/20',
                      keyword.sentiment === 'negative' && 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    )}
                    style={{ fontSize: `${size}rem` }}
                  >
                    {keyword.word}
                    <span className="ml-2 opacity-60">({keyword.count})</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Sentiment Breakdown */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Sentiment Score</h3>
            </div>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(152, 69%, 40%)"
                  strokeWidth="12"
                  strokeDasharray={`${overallSentiment.positive * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{overallSentiment.positive}%</span>
                <span className="text-sm text-muted-foreground">Positive</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">Positive</span>
                </div>
                <span className="font-semibold text-foreground">{overallSentiment.positive}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Neutral</span>
                </div>
                <span className="font-semibold text-foreground">{overallSentiment.neutral}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-muted-foreground">Negative</span>
                </div>
                <span className="font-semibold text-foreground">{overallSentiment.negative}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Competitor Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reputation Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Reviews</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {competitorData.map((competitor, index) => (
                  <tr key={competitor.name} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                          index === 0 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
                        )}>
                          {competitor.name.charAt(0)}
                        </div>
                        <span className={cn(
                          'font-medium',
                          index === 0 ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {competitor.name}
                          {index === 0 && <span className="ml-2 text-xs text-accent">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${competitor.score}%` }}
                          />
                        </div>
                        <span className="font-semibold text-foreground">{competitor.score}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {competitor.reviews.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        competitor.trend >= 0 ? 'text-success' : 'text-destructive'
                      )}>
                        {competitor.trend >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{competitor.trend >= 0 ? '+' : ''}{competitor.trend}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Positive Action</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your customer service mentions have increased 23% positively. Consider highlighting this in marketing materials.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">Attention Needed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Billing-related complaints have increased 15% this month. Review pricing communication strategy.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-info/5 border border-info/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-info" />
                <span className="font-medium text-info">Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Competitors are weak on integrations. Promote your integration capabilities to capture market share.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
