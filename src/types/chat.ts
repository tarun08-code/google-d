export interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    attachmentUrl?: string;
    attachmentType?: string;
}

export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
}

export interface ChatContextType {
    state: ChatState;
    sendMessage: (message: string) => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    clearChat: () => void;
}

export interface BotResponse {
    text: string;
    timestamp: Date;
}