import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  FileText, 
  AlertTriangle, 
  Newspaper, 
  Tag, 
  Mic,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const aiTools = [
  {
    id: 'summarizer',
    name: 'Review Summarizer',
    description: 'Automatically summarize long reviews into key points and actionable insights.',
    icon: FileText,
    color: 'bg-accent/10 text-accent',
  },
  {
    id: 'crisis',
    name: 'Crisis Response Generator',
    description: 'Generate appropriate responses for critical reviews and PR situations.',
    icon: AlertTriangle,
    color: 'bg-destructive/10 text-destructive',
  },
  {
    id: 'pr-writer',
    name: 'PR Statement Writer',
    description: 'Create professional press releases and public statements.',
    icon: Newspaper,
    color: 'bg-info/10 text-info',
  },
  {
    id: 'classifier',
    name: 'Complaint Classifier',
    description: 'Automatically categorize complaints by type, urgency, and department.',
    icon: Tag,
    color: 'bg-warning/10 text-warning',
  },
  {
    id: 'tone-trainer',
    name: 'Brand Tone Trainer',
    description: 'Train the AI to match your brand voice and communication style.',
    icon: Mic,
    color: 'bg-success/10 text-success',
  },
  {
    id: 'insight-gen',
    name: 'Insight Generator',
    description: 'Generate deep insights and recommendations from review data.',
    icon: Brain,
    color: 'bg-accent/10 text-accent',
  },
];

export default function AITools() {
  return (
    <MainLayout>
      <Header 
        title="AI Tools" 
        subtitle="Powerful AI utilities for reputation management"
      />
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Hero */}
        <div className="card-elevated p-8 bg-gradient-to-br from-accent/5 to-info/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">AI-Powered Tools</h2>
              <p className="text-muted-foreground max-w-2xl mb-4">
                Leverage the power of artificial intelligence to streamline your reputation management workflow. 
                These tools help you respond faster, analyze deeper, and communicate better.
              </p>
              <Button className="btn-gradient gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <div key={tool.id} className="card-elevated p-6 group cursor-pointer">
              <div className={`p-3 rounded-xl w-fit mb-4 ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <Button variant="outline" size="sm" className="gap-2 group-hover:border-accent group-hover:text-accent transition-all">
                Launch Tool
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Try Review Summarizer</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Paste a review</label>
              <textarea
                placeholder="Paste a long review here to summarize..."
                className="w-full h-40 p-4 rounded-lg bg-secondary border-0 resize-none focus:ring-2 focus:ring-accent focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
              <Button className="btn-gradient mt-4 gap-2">
                <Brain className="w-4 h-4" />
                Summarize
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Summary</label>
              <div className="h-40 p-4 rounded-lg bg-accent/5 border border-accent/20 overflow-y-auto">
                <p className="text-sm text-muted-foreground italic">
                  AI-generated summary will appear here...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">AI Usage This Month</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-foreground">1,247</p>
              <p className="text-sm text-muted-foreground">Summaries Generated</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-foreground">342</p>
              <p className="text-sm text-muted-foreground">Responses Created</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-foreground">89</p>
              <p className="text-sm text-muted-foreground">Crisis Responses</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-foreground">2.3K</p>
              <p className="text-sm text-muted-foreground">Reviews Classified</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
