import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Mail, 
  MessageSquare, 
  Phone, 
  Bell,
  Plus,
  Play,
  Settings,
  BarChart3
} from 'lucide-react';

const funnels = [
  {
    id: '1',
    name: 'Post-Purchase Review',
    trigger: 'Purchase completed',
    channels: ['email', 'sms'],
    status: 'active',
    sent: 1250,
    converted: 312,
  },
  {
    id: '2',
    name: 'Support Ticket Closed',
    trigger: 'Ticket resolved',
    channels: ['email'],
    status: 'active',
    sent: 450,
    converted: 89,
  },
  {
    id: '3',
    name: 'Demo Completed',
    trigger: 'Demo finished',
    channels: ['email', 'whatsapp'],
    status: 'paused',
    sent: 120,
    converted: 34,
  },
  {
    id: '4',
    name: 'Employee Exit',
    trigger: 'Offboarding complete',
    channels: ['email'],
    status: 'draft',
    sent: 0,
    converted: 0,
  },
];

const channelIcons: Record<string, React.ElementType> = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: Phone,
  'in-app': Bell,
};

export default function ReviewFunnels() {
  return (
    <MainLayout>
      <Header 
        title="Review Funnels" 
        subtitle="Automate review collection with smart funnels"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Active Funnels</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {funnels.filter(f => f.status === 'active').length}
            </p>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-info" />
              <span className="text-sm text-muted-foreground">Requests Sent</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {funnels.reduce((acc, f) => acc + f.sent, 0).toLocaleString()}
            </p>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Reviews Collected</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {funnels.reduce((acc, f) => acc + f.converted, 0)}
            </p>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-warning" />
              <span className="text-sm text-muted-foreground">Avg Conversion</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(funnels.reduce((acc, f) => acc + f.converted, 0) / funnels.reduce((acc, f) => acc + f.sent, 0) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-end">
          <Button className="btn-gradient gap-2">
            <Plus className="w-4 h-4" />
            Create Funnel
          </Button>
        </div>

        {/* Funnels List */}
        <div className="space-y-4">
          {funnels.map((funnel) => (
            <div key={funnel.id} className="card-elevated p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <Rocket className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{funnel.name}</h4>
                    <p className="text-sm text-muted-foreground">Trigger: {funnel.trigger}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Channels */}
                  <div className="flex items-center gap-2">
                    {funnel.channels.map((channel) => {
                      const Icon = channelIcons[channel] || Mail;
                      return (
                        <div key={channel} className="p-2 rounded-lg bg-secondary" title={channel}>
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{funnel.sent.toLocaleString()} sent</p>
                    <p className="text-xs text-muted-foreground">
                      {funnel.converted} converted ({funnel.sent > 0 ? ((funnel.converted / funnel.sent) * 100).toFixed(1) : 0}%)
                    </p>
                  </div>

                  {/* Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    funnel.status === 'active' ? 'bg-success/10 text-success' :
                    funnel.status === 'paused' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {funnel.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {funnel.status !== 'active' && (
                      <Button variant="outline" size="sm" className="gap-1">
                        <Play className="w-3.5 h-3.5" />
                        Start
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Funnel Builder Placeholder */}
        <div className="card-elevated p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Drag-and-Drop Funnel Builder</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Build custom review request funnels with our visual builder. Add triggers, conditions, and channels.
          </p>
          <Button variant="outline">Open Builder</Button>
        </div>
      </div>
    </MainLayout>
  );
}
