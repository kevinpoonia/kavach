import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  Link, 
  Mail, 
  Copy, 
  Download, 
  ExternalLink,
  Palette,
  Settings,
  BarChart3
} from 'lucide-react';

const campaigns = [
  {
    id: '1',
    name: 'Product Review QR',
    type: 'qr',
    shortUrl: 'rpls.co/pro-review',
    scans: 1245,
    conversions: 312,
    status: 'active',
  },
  {
    id: '2',
    name: 'Restaurant Table Cards',
    type: 'qr',
    shortUrl: 'rpls.co/dine-review',
    scans: 856,
    conversions: 234,
    status: 'active',
  },
  {
    id: '3',
    name: 'Email Signature Link',
    type: 'link',
    shortUrl: 'rpls.co/feedback',
    scans: 2341,
    conversions: 567,
    status: 'active',
  },
  {
    id: '4',
    name: 'Post-Event Feedback',
    type: 'email',
    shortUrl: 'rpls.co/event-fb',
    scans: 450,
    conversions: 89,
    status: 'paused',
  },
];

export default function QRCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);

  return (
    <MainLayout>
      <Header 
        title="QR & Campaigns" 
        subtitle="Generate QR codes and manage review collection campaigns"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card-elevated p-4">
            <QrCode className="w-5 h-5 text-accent mb-2" />
            <p className="text-2xl font-bold text-foreground">{campaigns.length}</p>
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
          </div>
          <div className="card-elevated p-4">
            <BarChart3 className="w-5 h-5 text-info mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {campaigns.reduce((acc, c) => acc + c.scans, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Scans</p>
          </div>
          <div className="card-elevated p-4">
            <Link className="w-5 h-5 text-success mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {campaigns.reduce((acc, c) => acc + c.conversions, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Reviews Collected</p>
          </div>
          <div className="card-elevated p-4">
            <BarChart3 className="w-5 h-5 text-warning mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {((campaigns.reduce((acc, c) => acc + c.conversions, 0) / campaigns.reduce((acc, c) => acc + c.scans, 0)) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Generator */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-accent" />
              QR Code Generator
            </h3>
            
            {/* Mock QR Code */}
            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-xl p-4 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-foreground to-foreground/80 rounded-lg" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23000' x='0' y='0' width='25' height='25'/%3E%3Crect fill='%23000' x='75' y='0' width='25' height='25'/%3E%3Crect fill='%23000' x='0' y='75' width='25' height='25'/%3E%3Crect fill='%23fff' x='5' y='5' width='15' height='15'/%3E%3Crect fill='%23fff' x='80' y='5' width='15' height='15'/%3E%3Crect fill='%23fff' x='5' y='80' width='15' height='15'/%3E%3Crect fill='%23000' x='8' y='8' width='9' height='9'/%3E%3Crect fill='%23000' x='83' y='8' width='9' height='9'/%3E%3Crect fill='%23000' x='8' y='83' width='9' height='9'/%3E%3Crect fill='%23000' x='30' y='30' width='40' height='40'/%3E%3Crect fill='%23fff' x='35' y='35' width='30' height='30'/%3E%3Crect fill='%23000' x='40' y='40' width='20' height='20'/%3E%3C/svg%3E")`,
                     backgroundSize: 'cover'
                   }} 
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                <Link className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground flex-1">{selectedCampaign.shortUrl}</span>
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Customize
                </Button>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="lg:col-span-2 card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Active Campaigns</h3>
              <Button className="btn-gradient gap-2" size="sm">
                Create Campaign
              </Button>
            </div>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(campaign)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedCampaign.id === campaign.id 
                      ? 'bg-accent/10 border border-accent/30' 
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {campaign.type === 'qr' && <QrCode className="w-5 h-5 text-accent" />}
                      {campaign.type === 'link' && <Link className="w-5 h-5 text-info" />}
                      {campaign.type === 'email' && <Mail className="w-5 h-5 text-warning" />}
                      <div>
                        <p className="font-medium text-foreground">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">{campaign.shortUrl}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{campaign.scans.toLocaleString()} scans</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.conversions} reviews ({((campaign.conversions / campaign.scans) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Landing Page Builder */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Review Landing Page Builder</h3>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Preview
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <div className="w-full h-32 bg-gradient-to-br from-accent/20 to-info/20 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">⭐</span>
              </div>
              <p className="font-medium text-foreground">Rating Collection</p>
              <p className="text-xs text-muted-foreground">Simple star rating page</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <div className="w-full h-32 bg-gradient-to-br from-success/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <p className="font-medium text-foreground">Feedback Form</p>
              <p className="text-xs text-muted-foreground">Detailed feedback collection</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <div className="w-full h-32 bg-gradient-to-br from-warning/20 to-destructive/20 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">🎉</span>
              </div>
              <p className="font-medium text-foreground">Thank You Page</p>
              <p className="text-xs text-muted-foreground">Post-review appreciation</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
