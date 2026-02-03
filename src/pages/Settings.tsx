import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { integrations, Integration } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Plug, 
  Check, 
  Settings, 
  ExternalLink,
  Star,
  Building,
  Grid,
  MapPin,
  MessageCircle,
  Twitter,
  Headphones,
  Inbox,
  Cloud,
  Slack,
  Phone,
  Mail,
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Globe
} from 'lucide-react';

const categoryLabels: Record<string, string> = {
  reviews: 'Review Platforms',
  crm: 'CRM & Support',
  communication: 'Communication',
  analytics: 'Analytics',
};

const iconMap: Record<string, React.ElementType> = {
  google: Globe,
  star: Star,
  building: Building,
  grid: Grid,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  twitter: Twitter,
  headphones: Headphones,
  inbox: Inbox,
  hub: Cloud,
  cloud: Cloud,
  slack: Slack,
  phone: Phone,
  mail: Mail,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('integrations');

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <MainLayout>
      <Header 
        title="Settings" 
        subtitle="Manage integrations and preferences"
      />
      <div className="p-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="card-elevated p-4">
            <nav className="space-y-1">
              {[
                { id: 'integrations', label: 'Integrations', icon: Plug },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'appearance', label: 'Appearance', icon: Palette },
                { id: 'billing', label: 'Billing', icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    activeTab === item.id 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'integrations' && (
              <>
                {/* Connected Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card-elevated p-4">
                    <p className="text-2xl font-bold text-foreground">
                      {integrations.filter(i => i.connected).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                  <div className="card-elevated p-4">
                    <p className="text-2xl font-bold text-foreground">
                      {integrations.filter(i => !i.connected).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                  <div className="card-elevated p-4">
                    <p className="text-2xl font-bold text-foreground">
                      {integrations.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Integrations</p>
                  </div>
                </div>

                {/* Integration Categories */}
                {Object.entries(groupedIntegrations).map(([category, items]) => (
                  <div key={category} className="card-elevated p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {categoryLabels[category]}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((integration) => {
                        const Icon = iconMap[integration.icon] || Plug;
                        return (
                          <div
                            key={integration.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'p-2.5 rounded-xl',
                                integration.connected ? 'bg-success/10' : 'bg-muted'
                              )}>
                                <Icon className={cn(
                                  'w-5 h-5',
                                  integration.connected ? 'text-success' : 'text-muted-foreground'
                                )} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{integration.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {integration.connected ? 'Connected' : 'Not connected'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {integration.connected ? (
                                <>
                                  <span className="flex items-center gap-1 text-success text-xs font-medium">
                                    <Check className="w-3.5 h-3.5" />
                                    Active
                                  </span>
                                  <Button variant="ghost" size="sm">
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button size="sm" variant="outline" className="gap-2">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Connect
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'profile' && (
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Alex Thompson"
                      className="input-search w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="alex@repupulse.com"
                      className="input-search w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                    <input
                      type="text"
                      defaultValue="RepuPulse Inc."
                      className="input-search w-full"
                    />
                  </div>
                  <Button className="btn-gradient">Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Negative review alerts', description: 'Get notified when a negative review is posted' },
                    { label: 'Review spikes', description: 'Alert when review volume is unusually high' },
                    { label: 'Reputation score changes', description: 'Weekly updates on your reputation score' },
                    { label: 'Team mentions', description: 'When someone mentions you in a comment' },
                    { label: 'Response reminders', description: 'Reminders for reviews pending response' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={index < 3} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-accent peer-focus:ring-2 peer-focus:ring-accent/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'security' || activeTab === 'appearance' || activeTab === 'billing') && (
              <div className="card-elevated p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    {activeTab === 'security' && <Shield className="w-8 h-8 text-muted-foreground" />}
                    {activeTab === 'appearance' && <Palette className="w-8 h-8 text-muted-foreground" />}
                    {activeTab === 'billing' && <CreditCard className="w-8 h-8 text-muted-foreground" />}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    This section is ready for backend integration.
                  </p>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
