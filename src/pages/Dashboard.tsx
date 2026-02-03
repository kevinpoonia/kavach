import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { PlatformStats } from '@/components/dashboard/PlatformStats';
import { RecentReviews } from '@/components/dashboard/RecentReviews';
import { AlertsWidget } from '@/components/dashboard/AlertsWidget';
import { dashboardMetrics } from '@/lib/mockData';

export default function Dashboard() {
  return (
    <MainLayout>
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's your reputation overview."
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrendChart />
          </div>
          <div>
            <SentimentChart positive={75} neutral={17} negative={8} />
          </div>
        </div>

        {/* Platform & Reviews Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlatformStats />
          <RecentReviews />
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsWidget />
        </div>
      </div>
    </MainLayout>
  );
}
