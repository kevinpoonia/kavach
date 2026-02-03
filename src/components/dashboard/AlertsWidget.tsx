import React from 'react';
import { alerts } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, Flame, TrendingDown, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const alertIcons = {
  negative: AlertTriangle,
  spike: TrendingUp,
  viral: Flame,
  drop: TrendingDown,
};

const alertColors = {
  negative: 'text-destructive bg-destructive/10',
  spike: 'text-info bg-info/10',
  viral: 'text-warning bg-warning/10',
  drop: 'text-destructive bg-destructive/10',
};

export function AlertsWidget() {
  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        </div>
        <Link 
          to="/alerts" 
          className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {recentAlerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
                alert.read ? 'bg-secondary/30' : 'bg-secondary/70'
              )}
            >
              <div className={cn('p-2 rounded-lg', alertColors[alert.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    'text-sm truncate',
                    alert.read ? 'text-muted-foreground' : 'text-foreground font-medium'
                  )}>
                    {alert.title}
                  </p>
                  {!alert.read && (
                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {alert.description}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
