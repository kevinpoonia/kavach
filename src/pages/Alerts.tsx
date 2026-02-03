import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { alerts } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  Flame, 
  TrendingDown, 
  Check, 
  Bell,
  Filter,
  CheckCheck
} from 'lucide-react';

const alertIcons = {
  negative: AlertTriangle,
  spike: TrendingUp,
  viral: Flame,
  drop: TrendingDown,
};

const alertColors = {
  negative: 'text-destructive bg-destructive/10 border-destructive/20',
  spike: 'text-info bg-info/10 border-info/20',
  viral: 'text-warning bg-warning/10 border-warning/20',
  drop: 'text-destructive bg-destructive/10 border-destructive/20',
};

export default function Alerts() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [alertList, setAlertList] = useState(alerts);

  const filteredAlerts = filter === 'all' 
    ? alertList 
    : alertList.filter(a => !a.read);

  const markAsRead = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlertList(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <MainLayout>
      <Header 
        title="Alerts" 
        subtitle="Stay informed about important reputation events"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alertList.filter(a => a.type === 'negative').length}
              </p>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-info/10">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alertList.filter(a => a.type === 'spike').length}
              </p>
              <p className="text-sm text-muted-foreground">Volume Spikes</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <Flame className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alertList.filter(a => a.type === 'viral').length}
              </p>
              <p className="text-sm text-muted-foreground">Viral Mentions</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alertList.filter(a => !a.read).length}
              </p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="card-elevated p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filter === 'all' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filter === 'unread' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              Unread
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </Button>
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const Icon = alertIcons[alert.type];
            return (
              <div
                key={alert.id}
                className={cn(
                  'card-elevated p-5 transition-all',
                  !alert.read && 'ring-2 ring-accent/30'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('p-3 rounded-xl border', alertColors[alert.type])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        'font-semibold',
                        alert.read ? 'text-muted-foreground' : 'text-foreground'
                      )}>
                        {alert.title}
                      </h4>
                      {!alert.read && (
                        <span className="w-2 h-2 bg-accent rounded-full" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground/70">{alert.time}</span>
                      <div className="flex items-center gap-2">
                        {!alert.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(alert.id)}
                            className="gap-1 text-accent hover:text-accent"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Mark Read
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="card-elevated p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No alerts</h3>
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'All alerts have been read.' : 'No alerts to display.'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
