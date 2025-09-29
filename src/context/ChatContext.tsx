import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ChatState, ChatContextType, ChatMessage } from '../types/chat';
import { AIService } from '../services/AIService';

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    error: null,
};

type ChatAction =
    | { type: 'ADD_MESSAGE'; payload: ChatMessage }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_CHAT' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'CLEAR_CHAT':
            return {
                ...initialState,
            };
        default:
            return state;
    }
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    const aiService = new AIService();
    const messageHistory: string[] = [];

    const generateBotResponse = async (userMessage: string): Promise<string> => {
        try {
            messageHistory.push(userMessage);
            const response = await aiService.generateResponse(userMessage, messageHistory);
            
            // Get smart reply suggestions for future use
            const smartReplies = await aiService.getSmartReplies(userMessage);
            const sentiment = await aiService.analyzeSentiment(userMessage);
            
            // You can use smartReplies and sentiment in your UI
            console.log('Smart Replies:', smartReplies);
            console.log('Message Sentiment:', sentiment);
            
            return response.text;
        } catch (error) {
            console.error('Error generating bot response:', error);
            return 'I apologize, but I encountered an error. Could you please try rephrasing your message?';
        }
    };

    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date(),
        };

        // Add user message to state
        dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // Generate bot response (in-memory; no persistence)
            const botResponseText = await generateBotResponse(message);
            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: botResponseText,
                sender: 'bot',
                timestamp: new Date(),
            };

            dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: 'Failed to send message. Please try again.',
            });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const clearChat = () => {
        dispatch({ type: 'CLEAR_CHAT' });
    };

    const addMessage = (message: ChatMessage) => {
        dispatch({ type: 'ADD_MESSAGE', payload: message });
    };

    return (
        <ChatContext.Provider value={{ state, sendMessage, addMessage, clearChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};