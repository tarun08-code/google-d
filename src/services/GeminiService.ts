import { GoogleGenerativeAI } from '@google/generative-ai';
import hackathonContext from '../context/hackathon-context.json';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

class GeminiService {
  private model;
  private context: string;
  private modelName: string;

  constructor() {
    // Use the correct model names from the available models
    this.modelName = 'models/gemini-2.0-flash';
    this.model = genAI.getGenerativeModel({ model: this.modelName });
    this.context = this.buildContextFromJSON();
  }

  private buildContextFromJSON(): string {
    const context = `
You are a helpful assistant for TechHack 2025, a 48-hour hackathon focused on AI & Machine Learning Innovation. 
Here's the comprehensive information about the event:

EVENT DETAILS:
- Name: ${hackathonContext.event.name}
- Theme: ${hackathonContext.event.theme}
- Duration: ${hackathonContext.event.duration}
- Dates: ${hackathonContext.event.dates}
- Location: ${hackathonContext.event.location.name}, ${hackathonContext.event.location.address}

VENUE LAYOUT:
- Ground Floor: ${hackathonContext.event.location.floors.ground_floor.join(', ')}
- Second Floor: ${hackathonContext.event.location.floors.second_floor.join(', ')}
- Third Floor: ${hackathonContext.event.location.floors.third_floor.join(', ')}
- All Floors: ${hackathonContext.event.location.floors.all_floors.join(', ')}

SCHEDULE:
${Object.entries(hackathonContext.schedule).map(([_, data]: [string, any]) => 
  `${data.date}:\n${data.events.map((event: any) => `  ${event.time} - ${event.title} (${event.location})`).join('\n')}`
).join('\n\n')}

FACILITIES:
- WiFi: Network "${hackathonContext.facilities.wifi.network}", Password "${hackathonContext.facilities.wifi.password}"
- Food: ${hackathonContext.facilities.food.food_court}
- Coffee: ${hackathonContext.facilities.food.coffee_stations}
- Dietary Options: ${hackathonContext.facilities.food.dietary_options.join(', ')}
- Amenities: ${hackathonContext.facilities.amenities.join(', ')}

SUPPORT CONTACTS:
- Emergency: ${hackathonContext.support.emergency}
- Technical Support: ${hackathonContext.support.technical_support}
- General Inquiries: ${hackathonContext.support.general_inquiries}
- Medical: ${hackathonContext.support.medical}

COMPETITION DETAILS:
- Team Size: ${hackathonContext.rules.team_size}
- Submission Deadline: ${hackathonContext.rules.submission_deadline}
- Presentation Time: ${hackathonContext.rules.presentation_time}
- Judging Criteria: ${hackathonContext.rules.judging_criteria.join(', ')}

PRIZES:
- 1st Place: ${hackathonContext.rules.prizes.first_place}
- 2nd Place: ${hackathonContext.rules.prizes.second_place}
- 3rd Place: ${hackathonContext.rules.prizes.third_place}
- Best AI Implementation: ${hackathonContext.rules.prizes.best_ai_implementation}
- Most Creative: ${hackathonContext.rules.prizes.most_creative}

TRACKS:
${hackathonContext.tracks.map(track => `- ${track.name}: ${track.description}`).join('\n')}

WORKSHOPS:
${hackathonContext.workshops.map(workshop => `- ${workshop.title} (${workshop.time}, ${workshop.duration}) at ${workshop.location} by ${workshop.instructor}`).join('\n')}

SPONSORS:
- Platinum: ${hackathonContext.sponsors.platinum.join(', ')}
- Gold: ${hackathonContext.sponsors.gold.join(', ')}
- Silver: ${hackathonContext.sponsors.silver.join(', ')}
- Bronze: ${hackathonContext.sponsors.bronze.join(', ')}

Instructions:
1. Always be helpful, friendly, and enthusiastic about the hackathon
2. Provide specific, accurate information based on the context above
3. If asked about something not in the context, politely say you don't have that specific information
4. Encourage participation and help users make the most of their hackathon experience
5. For technical questions outside the event scope, provide general guidance but remind them about on-site technical support
6. Keep responses concise but informative
7. Use emojis sparingly but appropriately to maintain a friendly tone
`;

    return context;
  }

  async generateResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
    try {
      // Build conversation context
      const conversation = conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const prompt = `
${this.context}

Previous conversation:
${conversation}

Current user message: ${userMessage}

Please respond as the TechHack 2025 assistant:
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback responses for common queries
      const fallbackResponse = this.getFallbackResponse(userMessage);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      
      return "I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment, or contact our technical support at tech@techhack2025.com for immediate assistance.";
    }
  }

  private getFallbackResponse(userMessage: string): string | null {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('wifi') || lowerMessage.includes('password')) {
      return `The Wi-Fi network is "${hackathonContext.facilities.wifi.network}" and the password is "${hackathonContext.facilities.wifi.password}". 📶`;
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('lunch') || lowerMessage.includes('dinner')) {
      return `The food court is open 24/7 on the 2nd floor! We also have coffee stations on all floors. 🍕☕`;
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('venue')) {
      return `TechHack 2025 is at ${hackathonContext.event.location.name}, ${hackathonContext.event.location.address}. Check your dashboard for venue navigation! 📍`;
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('event')) {
      return `You can find the full schedule in your dashboard, but we're currently in the hacking phase! The final presentations are on March 17 at 3:00 PM. 🗓️`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return `For technical support, email tech@techhack2025.com or visit mentor stations (available 24/7). For emergencies, call ${hackathonContext.support.emergency}. 🆘`;
    }
    
    return null;
  }

  async testConnection(): Promise<boolean> {
    // Use the correct model names from the available models list
    const modelNames = [
      'models/gemini-2.0-flash',
      'models/gemini-pro-latest', 
      'models/gemini-flash-latest',
      'models/gemini-2.5-flash',
      'models/gemini-2.5-pro'
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const testModel = genAI.getGenerativeModel({ model: modelName });
        
        // Use a simple test prompt
        const result = await testModel.generateContent('Hello');
        const response = await result.response;
        const text = response.text();
        
        if (text && text.length > 0) {
          console.log(`✅ Successfully connected with model: ${modelName}`);
          console.log(`Response: ${text.substring(0, 100)}...`);
          // Update the service to use the working model
          this.model = testModel;
          this.modelName = modelName;
          return true;
        }
      } catch (error: any) {
        console.error(`❌ Model ${modelName} failed:`, error?.message || error);
        continue; // Try next model
      }
    }
    
    console.error('❌ All Gemini models failed to connect');
    return false;
  }
}

export default GeminiService;