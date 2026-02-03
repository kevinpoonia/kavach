import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { reviewVolumeData, sentimentTrendData } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Clock, CheckCircle, MessageSquare, Star } from 'lucide-react';

const responseTimeData = [
  { day: 'Mon', time: 2.1 },
  { day: 'Tue', time: 1.8 },
  { day: 'Wed', time: 2.4 },
  { day: 'Thu', time: 1.9 },
  { day: 'Fri', time: 2.2 },
  { day: 'Sat', time: 3.1 },
  { day: 'Sun', time: 3.5 },
];

const funnelData = [
  { name: 'Requests Sent', value: 1250 },
  { name: 'Opened', value: 875 },
  { name: 'Clicked', value: 520 },
  { name: 'Submitted', value: 312 },
];

export default function Analytics() {
  return (
    <MainLayout>
      <Header 
        title="Analytics" 
        subtitle="Track performance metrics and trends"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Avg Rating</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">4.3</span>
              <span className="text-sm text-success flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +0.2
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-info/10">
                <MessageSquare className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm text-muted-foreground">Total Reviews</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">2,847</span>
              <span className="text-sm text-success flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Avg Response Time</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">2.4h</span>
              <span className="text-sm text-success flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                -18%
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-success/10">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Resolution Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">94%</span>
              <span className="text-sm text-success flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +5%
              </span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Review Volume */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Review Volume by Platform</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reviewVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="google" fill="hsl(217, 89%, 61%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="trustpilot" fill="hsl(152, 69%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="g2" fill="hsl(11, 100%, 62%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="glassdoor" fill="hsl(152, 76%, 38%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response Time */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Response Time (Hours)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}h`, 'Response Time']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Funnel & Sentiment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Review Funnel */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Review Request Funnel</h3>
            <div className="space-y-4">
              {funnelData.map((item, index) => {
                const percentage = (item.value / funnelData[0].value) * 100;
                const conversionRate = index > 0 
                  ? ((item.value / funnelData[index - 1].value) * 100).toFixed(1) 
                  : '100';
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{item.value.toLocaleString()}</span>
                        {index > 0 && (
                          <span className="text-xs text-accent">{conversionRate}% conversion</span>
                        )}
                      </div>
                    </div>
                    <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-info transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sentiment Over Time */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Sentiment Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentTrendData}>
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="hsl(152, 69%, 40%)" 
                    fillOpacity={1} 
                    fill="url(#colorPositive)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
