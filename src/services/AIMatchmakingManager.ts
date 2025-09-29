import { aiMatchmakingService } from './GeminiService';
import { mockDataService } from './MockDataService';

export interface MatchSuggestion {
  id: string;
  name: string;
  interests: string[];
  company: string;
  role: string;
  matchReason: string;
  avatar: string;
  commonInterests?: string[];
  suggestionType?: 'collaboration' | 'mentorship' | 'networking';
  confidenceScore?: number;
}

class AIMatchmakingManager {
  private suggestionQueue: MatchSuggestion[] = [];
  // private isProcessing = false; // Commented out - reserved for future queue processing logic
  private lastSuggestionTime = 0;
  private readonly SUGGESTION_INTERVAL = 15000; // 15 seconds between suggestions

  constructor() {
    this.initializeSuggestions();
  }

  // Initialize and start the suggestion engine
  async initializeSuggestions() {
    try {
      const currentUser = mockDataService.getCurrentUser();
      const participants = mockDataService.getEventParticipants();
      
      // Generate AI suggestions
      const suggestions = await aiMatchmakingService.generateMatchingSuggestions(
        currentUser, 
        participants
      );
      
      this.suggestionQueue = suggestions;
      console.log('AI Matchmaking initialized with', suggestions.length, 'suggestions');
    } catch (error) {
      console.error('Failed to initialize AI matchmaking:', error);
      // Use fallback suggestions
      this.suggestionQueue = this.getFallbackSuggestions();
    }
  }

  // Get next suggestion if enough time has passed
  getNextSuggestion(): MatchSuggestion | null {
    const now = Date.now();
    
    if (now - this.lastSuggestionTime < this.SUGGESTION_INTERVAL) {
      return null; // Too soon for next suggestion
    }

    if (this.suggestionQueue.length === 0) {
      // Reinitialize suggestions if queue is empty
      this.initializeSuggestions();
      return null;
    }

    const suggestion = this.suggestionQueue.shift();
    this.lastSuggestionTime = now;
    
    return suggestion || null;
  }

  // Generate connection message
  async generateConnectionMessage(
    targetPerson: string, 
    matchReason: string
  ): Promise<string> {
    try {
      const currentUser = mockDataService.getCurrentUser();
      const target = mockDataService.getEventParticipants()
        .find(p => p.name === targetPerson);
      
      if (!target) {
        return this.getDefaultConnectionMessage(targetPerson);
      }

      return await aiMatchmakingService.generateConnectionMessage(
        currentUser,
        target,
        matchReason
      );
    } catch (error) {
      console.error('Failed to generate connection message:', error);
      return this.getDefaultConnectionMessage(targetPerson);
    }
  }

  private getDefaultConnectionMessage(targetPerson: string): string {
    return `Hi ${targetPerson}! I noticed we share similar interests at this event. Would love to connect and explore potential collaboration opportunities!`;
  }

  private getFallbackSuggestions(): MatchSuggestion[] {
    return [
      {
        id: 'fallback_1',
        name: 'Sarah Chen',
        interests: ['AI', 'Machine Learning', 'Python'],
        company: 'TechCorp AI',
        role: 'ML Engineer',
        matchReason: 'Shared interest in AI and Machine Learning',
        avatar: '👩‍💻',
        commonInterests: ['AI', 'Machine Learning', 'Python'],
        suggestionType: 'collaboration',
        confidenceScore: 89
      },
      {
        id: 'fallback_2',
        name: 'Emma Thompson',
        interests: ['Product Development', 'User Experience', 'Design'],
        company: 'Design Studio Pro',
        role: 'UX Designer',
        matchReason: 'Complementary skills in UX and Development',
        avatar: '👩‍🎨',
        commonInterests: ['Product Development', 'User Experience'],
        suggestionType: 'collaboration',
        confidenceScore: 82
      },
      {
        id: 'fallback_3',
        name: 'David Kim',
        interests: ['Startups', 'Business Development', 'Growth'],
        company: 'Startup Ventures Inc',
        role: 'Growth Manager',
        matchReason: 'Startup and growth expertise',
        avatar: '👨‍💼',
        commonInterests: ['Startups', 'Business Development'],
        suggestionType: 'mentorship',
        confidenceScore: 76
      }
    ];
  }

  // Reset suggestions (useful for demo)
  reset() {
    this.suggestionQueue = [];
    this.lastSuggestionTime = 0;
    this.initializeSuggestions();
  }

  // Get suggestion queue length (for debugging)
  getQueueLength(): number {
    return this.suggestionQueue.length;
  }
}

export const aiMatchmakingManager = new AIMatchmakingManager();