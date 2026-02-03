import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Trophy, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  'message-square': MessageSquare,
  clock: Clock,
  'check-circle': CheckCircle,
};

export function MetricCard({ title, value, change, changeLabel, icon, className }: MetricCardProps) {
  const Icon = iconMap[icon] || Trophy;
  const isPositive = change >= 0;
  const isTimeMetric = icon === 'clock';
  const displayPositive = isTimeMetric ? !isPositive : isPositive;

  return (
    <div className={cn('metric-card group', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div className={cn(
          'flex items-center gap-1 text-sm font-medium',
          displayPositive ? 'text-success' : 'text-destructive'
        )}>
          {displayPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{changeLabel}</p>
      </div>
    </div>
  );
}
