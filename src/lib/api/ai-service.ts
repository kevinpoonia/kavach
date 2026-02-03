import { SentimentResult } from './types';

export class AIService {
  private openaiApiKey: string;
  private geminiApiKey: string;
  private provider: 'openai' | 'gemini';

  constructor(
    openaiApiKey?: string,
    geminiApiKey?: string,
    provider: 'openai' | 'gemini' = 'openai'
  ) {
    this.openaiApiKey = openaiApiKey || '';
    this.geminiApiKey = geminiApiKey || '';
    this.provider = provider;
  }

  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      if (this.provider === 'openai' && this.openaiApiKey) {
        return await this.analyzeWithOpenAI(text);
      } else if (this.provider === 'gemini' && this.geminiApiKey) {
        return await this.analyzeWithGemini(text);
      } else {
        return this.generateMockSentiment(text);
      }
    } catch (error) {
      console.error('AI sentiment analysis error:', error);
      return this.generateMockSentiment(text);
    }
  }

  private async analyzeWithOpenAI(text: string): Promise<SentimentResult> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with JSON: {sentiment: "positive"|"negative"|"neutral", score: 0-1, keywords: string[]}',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const parsed = JSON.parse(content);
      return {
        sentiment: parsed.sentiment,
        score: parsed.score,
        keywords: parsed.keywords || [],
      };
    } catch {
      return this.generateMockSentiment(text);
    }
  }

  private async analyzeWithGemini(text: string): Promise<SentimentResult> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the sentiment of this text and respond with JSON: {sentiment: "positive"|"negative"|"neutral", score: 0-1, keywords: string[]}\n\nText: ${text}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (parsed) {
        return {
          sentiment: parsed.sentiment,
          score: parsed.score,
          keywords: parsed.keywords || [],
        };
      }
    } catch {
      return this.generateMockSentiment(text);
    }

    return this.generateMockSentiment(text);
  }

  private generateMockSentiment(text: string): SentimentResult {
    const positiveWords = [
      'great',
      'excellent',
      'amazing',
      'good',
      'happy',
      'love',
      'best',
      'wonderful',
      'fantastic',
      'perfect',
    ];
    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'hate',
      'worst',
      'poor',
      'disappointing',
      'horrible',
      'useless',
      'waste',
    ];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerText.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerText.includes(word)
    ).length;

    let sentiment: 'positive' | 'negative' | 'neutral';
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    const totalMentions = positiveCount + negativeCount || 1;
    const score = positiveCount / totalMentions;

    return {
      sentiment,
      score,
      keywords: [
        ...positiveWords.filter((word) => lowerText.includes(word)),
        ...negativeWords.filter((word) => lowerText.includes(word)),
      ],
    };
  }
}
