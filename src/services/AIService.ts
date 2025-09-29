// AI service configuration and types
export interface AIResponse {
    text: string;
    confidence?: number;
    context?: Record<string, any>;
}

export interface AIConfig {
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

const DEFAULT_CONFIG: Required<AIConfig> = {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150
};

export class AIService {
    private openAiKey: string;
    private googleApiKey: string;
    private config: Required<AIConfig>;

    constructor(config: Partial<AIConfig> = {}) {
        const metaEnv: any = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};
        this.openAiKey = metaEnv.VITE_OPENAI_API_KEY || '';
        this.googleApiKey = metaEnv.VITE_GOOGLE_API_KEY || '';
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    // Primary public method to generate a response. Prefers Google Generative API when VITE_GOOGLE_API_KEY is set.
    async generateResponse(message: string, context: string[] = []): Promise<AIResponse> {
        if (this.googleApiKey) {
            return this.generateWithGoogle(message);
        }

        if (this.openAiKey) {
            return this.generateWithOpenAI(message, context);
        }

        // Fallback: echo
        return { text: `Echo: ${message}` };
    }

    private async generateWithGoogle(message: string): Promise<AIResponse> {
        try {
            // Using Google Generative Language API (text-bison)
            const endpoint = `https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText?key=${this.googleApiKey}`;
            // Google API expects a different shape; use a simple prompt payload
            const body = {
                prompt: {
                    text: message
                },
                temperature: this.config.temperature,
                maxOutputTokens: this.config.maxTokens
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Google API error', res.status, text);
                throw new Error('Google Generative API request failed');
            }

            const data = await res.json();

            // Defensive extraction — different Google responses may vary
            const candidate = (data?.candidates && data.candidates[0]) || null;
            const generated = candidate?.output || candidate?.content || data?.output || data?.candidates?.[0]?.content || '';

            const text = typeof generated === 'string'
                ? generated
                : (candidate?.content?.map((c: any) => c?.text).join('') || data?.text || '');

            return { text, context: data };
        } catch (err) {
            console.error('Error generating with Google API', err);
            throw err;
        }
    }

    private async generateWithOpenAI(message: string, context: string[] = []): Promise<AIResponse> {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openAiKey}`
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant. Be concise and friendly.' },
                        ...context.map(msg => ({ role: 'user', content: msg })),
                        { role: 'user', content: message }
                    ],
                    temperature: this.config.temperature,
                    max_tokens: this.config.maxTokens
                })
            });

            if (!response.ok) {
                const txt = await response.text();
                console.error('OpenAI error', response.status, txt);
                throw new Error('Failed to generate AI response (OpenAI)');
            }

            const data = await response.json();
            const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
            return { text, confidence: 1 - this.config.temperature, context: data };
        } catch (error) {
            console.error('Error generating AI response (OpenAI):', error);
            throw error;
        }
    }

    async analyzeSentiment(message: string): Promise<'positive' | 'negative' | 'neutral'> {
        try {
            const res = await this.generateResponse(`Analyze the sentiment of this message and respond with only one word (positive, negative, or neutral): "${message}"`);
            const sentiment = res.text?.toLowerCase().trim() || 'neutral';
            if (['positive', 'negative', 'neutral'].includes(sentiment)) return sentiment as any;
            return 'neutral';
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            return 'neutral';
        }
    }

    async getSmartReplies(message: string): Promise<string[]> {
        try {
            const res = await this.generateResponse(`Generate 3 short, natural response suggestions for this message: "${message}". Separate them with ||| and keep each response under 50 characters.`);
            return (res.text || '').split('|||').map(s => s.trim()).filter(Boolean);
        } catch (error) {
            console.error('Error generating smart replies:', error);
            return [];
        }
    }
}