import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { competitorData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  BarChart3,
  Target,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const sentimentComparison = [
  { brand: 'Your Brand', positive: 75, neutral: 17, negative: 8 },
  { brand: 'Competitor A', positive: 68, neutral: 20, negative: 12 },
  { brand: 'Competitor B', positive: 62, neutral: 23, negative: 15 },
  { brand: 'Competitor C', positive: 71, neutral: 18, negative: 11 },
];

const radarData = [
  { category: 'Product Quality', you: 85, compA: 78, compB: 72 },
  { category: 'Customer Service', you: 92, compA: 75, compB: 80 },
  { category: 'Pricing', you: 70, compA: 82, compB: 88 },
  { category: 'Features', you: 88, compA: 85, compB: 75 },
  { category: 'Reliability', you: 90, compA: 72, compB: 78 },
  { category: 'Support', you: 85, compA: 70, compB: 82 },
];

export default function Competitors() {
  return (
    <MainLayout>
      <Header 
        title="Competitor Tracking" 
        subtitle="Monitor and compare competitor reputation"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Competitor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {competitorData.map((competitor, index) => (
            <div key={competitor.name} className={cn(
              'card-elevated p-5',
              index === 0 && 'ring-2 ring-accent'
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                  index === 0 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
                )}>
                  {competitor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {competitor.name}
                    {index === 0 && <span className="ml-2 text-xs text-accent">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{competitor.reviews.toLocaleString()} reviews</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{competitor.score}</p>
                  <p className="text-xs text-muted-foreground">Reputation Score</p>
                </div>
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
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Comparison */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Sentiment Comparison</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="brand" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="positive" fill="hsl(152, 69%, 40%)" stackId="a" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="neutral" fill="hsl(38, 92%, 50%)" stackId="a" />
                  <Bar dataKey="negative" fill="hsl(0, 72%, 51%)" stackId="a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Comparison */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Category Performance</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Radar name="Your Brand" dataKey="you" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Competitor A" dataKey="compA" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Competitor B" dataKey="compB" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.1} strokeWidth={2} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Competitive Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Your Advantage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You're leading in Customer Service (+17% vs avg) and Reliability (+15% vs avg). Leverage this in marketing.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">Watch Out</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Competitor B is gaining ground on Pricing perception. Consider adjusting pricing communication.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-info/5 border border-info/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-info" />
                <span className="font-medium text-info">Market Share</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your brand captures 28% of positive sentiment in the market, up 3% from last quarter.
              </p>
            </div>
          </div>
        </div>

        {/* Add Competitor */}
        <div className="card-elevated p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Track More Competitors</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Add competitors to monitor their reviews, sentiment, and market positioning.
          </p>
          <button className="btn-gradient px-6 py-2 rounded-lg">
            Add Competitor
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
