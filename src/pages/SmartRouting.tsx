import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  GitBranch, 
  Plus, 
  Star, 
  ArrowRight, 
  AlertTriangle,
  Settings,
  Play,
  Pause
} from 'lucide-react';

const routingRules = [
  {
    id: '1',
    name: 'Happy Customer Route',
    condition: 'Rating ≥ 4 stars',
    action: 'Send to public review page (Google, Trustpilot)',
    status: 'active',
    triggered: 1456,
  },
  {
    id: '2',
    name: 'Unhappy Customer Route',
    condition: 'Rating ≤ 3 stars',
    action: 'Send to private feedback form',
    status: 'active',
    triggered: 234,
  },
  {
    id: '3',
    name: 'Critical Alert',
    condition: 'Rating = 1 star OR contains "legal"',
    action: 'Escalate to Legal Team + Alert Manager',
    status: 'active',
    triggered: 12,
  },
  {
    id: '4',
    name: 'VIP Customer Detection',
    condition: 'Customer tier = Enterprise',
    action: 'Priority response + Account Manager notification',
    status: 'paused',
    triggered: 45,
  },
];

export default function SmartRouting() {
  return (
    <MainLayout>
      <Header 
        title="Smart Routing" 
        subtitle="AI-powered review routing and escalation rules"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-success/10">
                <Star className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Positive Routes</span>
            </div>
            <p className="text-3xl font-bold text-foreground">1,456</p>
            <p className="text-sm text-success">Happy customers sent to public reviews</p>
          </div>
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-warning/10">
                <GitBranch className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Negative Routes</span>
            </div>
            <p className="text-3xl font-bold text-foreground">234</p>
            <p className="text-sm text-warning">Unhappy customers routed to private feedback</p>
          </div>
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Escalations</span>
            </div>
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-sm text-destructive">Critical issues auto-escalated</p>
          </div>
        </div>

        {/* Create Rule */}
        <div className="flex justify-end">
          <Button className="btn-gradient gap-2">
            <Plus className="w-4 h-4" />
            Create Rule
          </Button>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {routingRules.map((rule) => (
            <div key={rule.id} className="card-elevated p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 mt-1">
                    <GitBranch className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{rule.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="px-2 py-0.5 rounded bg-secondary">IF: {rule.condition}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="px-2 py-0.5 rounded bg-accent/10 text-accent">THEN: {rule.action}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Triggered {rule.triggered} times
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rule.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {rule.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Builder */}
        <div className="card-elevated p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Routing Flow</h3>
          <div className="flex items-center justify-center gap-4 py-8">
            <div className="p-4 rounded-xl bg-info/10 border-2 border-info/30 text-center">
              <Star className="w-6 h-6 text-info mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Customer Feedback</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
            <div className="p-4 rounded-xl bg-accent/10 border-2 border-accent/30 text-center">
              <GitBranch className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">AI Analysis</p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-lg bg-success/10 text-center">
                <p className="text-xs font-medium text-success">Rating ≥ 4</p>
                <p className="text-xs text-muted-foreground">Public Review</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 text-center">
                <p className="text-xs font-medium text-warning">Rating ≤ 3</p>
                <p className="text-xs text-muted-foreground">Private Feedback</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 text-center">
                <p className="text-xs font-medium text-destructive">Critical</p>
                <p className="text-xs text-muted-foreground">Escalate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
