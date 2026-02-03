import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { mockReviews, responseTemplates } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Reply, 
  Star, 
  Sparkles, 
  Send, 
  FileText, 
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

const toneOptions = [
  { value: 'professional', label: 'Professional', color: 'bg-info/10 text-info' },
  { value: 'friendly', label: 'Friendly', color: 'bg-success/10 text-success' },
  { value: 'apologetic', label: 'Apologetic', color: 'bg-warning/10 text-warning' },
  { value: 'legal-safe', label: 'Legal-Safe', color: 'bg-destructive/10 text-destructive' },
  { value: 'supportive', label: 'Supportive', color: 'bg-accent/10 text-accent' },
];

export default function ResponseCenter() {
  const [selectedReview, setSelectedReview] = useState(mockReviews[2]);
  const [response, setResponse] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [showTemplates, setShowTemplates] = useState(false);

  const pendingReviews = mockReviews.filter(r => r.status === 'open' || r.status === 'escalated');

  const generateAIResponse = () => {
    const toneResponses: Record<string, string> = {
      professional: `Thank you for taking the time to share your feedback regarding ${selectedReview.topics[0] || 'your experience'}. We appreciate your candid input and take all customer concerns seriously. Our team is actively reviewing your comments to ensure we continue to improve our services.`,
      friendly: `Hey ${selectedReview.author.split(' ')[0]}! Thanks so much for reaching out and sharing your thoughts with us! We really value your feedback and want to make sure we get this right for you. 😊`,
      apologetic: `We sincerely apologize for the experience you've had. This is not the level of service we strive to provide, and we understand your frustration. Please accept our heartfelt apologies, and we would like to make this right.`,
      'legal-safe': `Thank you for your feedback. We have carefully reviewed your comments and take all concerns seriously. While we appreciate your perspective, we would like to discuss the specifics of your experience directly.`,
      supportive: `We hear you, and we're here to help. Your feedback about ${selectedReview.topics[0] || 'your experience'} is important to us. Let's work together to resolve this and ensure you have a better experience going forward.`,
    };
    setResponse(toneResponses[selectedTone]);
  };

  return (
    <MainLayout>
      <Header 
        title="Response Center" 
        subtitle="Manage and respond to reviews efficiently"
      />
      <div className="p-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Queue */}
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Review Queue</h3>
              <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
                {pendingReviews.length} pending
              </span>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
              {pendingReviews.map((review) => (
                <button
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-all',
                    selectedReview.id === review.id 
                      ? 'bg-accent/10 border border-accent/30' 
                      : 'bg-secondary/50 hover:bg-secondary'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm truncate">{review.author}</span>
                        {review.status === 'escalated' && (
                          <AlertCircle className="w-3.5 h-3.5 text-warning" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-3 h-3',
                              i < review.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{review.content}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Response Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Review */}
            <div className="card-elevated p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={selectedReview.avatar}
                  alt={selectedReview.author}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{selectedReview.author}</span>
                    <span className="text-sm text-muted-foreground">• {selectedReview.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < selectedReview.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-foreground">{selectedReview.content}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedReview.topics.map((topic) => (
                      <span key={topic} className="px-2 py-1 rounded-md text-xs bg-secondary text-muted-foreground">
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Response Composer */}
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Reply className="w-5 h-5 text-accent" />
                  Compose Response
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Templates
                </Button>
              </div>

              {/* Templates Panel */}
              {showTemplates && (
                <div className="mb-4 p-4 rounded-lg bg-secondary/50">
                  <h4 className="text-sm font-medium text-foreground mb-3">Quick Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {responseTemplates.slice(0, 4).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setResponse(template.content);
                          setShowTemplates(false);
                        }}
                        className="text-left p-3 rounded-lg bg-card hover:bg-secondary transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{template.name}</span>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.content}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tone Selector */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Select Tone</label>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedTone(tone.value)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        selectedTone === tone.value ? tone.color : 'bg-secondary text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Generate Button */}
              <Button
                onClick={generateAIResponse}
                variant="outline"
                className="w-full mb-4 gap-2"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                Generate AI Response
              </Button>

              {/* Text Area */}
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response here..."
                className="w-full h-40 p-4 rounded-lg bg-secondary border-0 resize-none focus:ring-2 focus:ring-accent focus:outline-none text-foreground placeholder:text-muted-foreground"
              />

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Draft saved
                  </span>
                  <span>{response.length} characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    Assign
                  </Button>
                  <Button className="btn-gradient gap-2">
                    <Send className="w-4 h-4" />
                    Send Response
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="card-elevated p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Mark as Responded
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-warning hover:text-warning">
                  <AlertCircle className="w-4 h-4" />
                  Escalate
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-success hover:text-success">
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
