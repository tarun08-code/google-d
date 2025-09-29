import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Paperclip } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    attachmentUrl?: string;
    attachmentType?: string;
}

interface ChatBotProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen = false, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hello! I\'m your hackathon assistant. How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(isOpen);
    const [showEmojis, setShowEmojis] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setIsChatOpen(isOpen);
    }, [isOpen]);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const generateBotResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('event') || lowerMessage.includes('schedule')) {
            return 'You can check all events in the Event section of your dashboard. There you can see upcoming workshops, networking sessions, and presentations.';
        } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
            return 'You can find help and support information in the Help & Support section of your sidebar. For emergencies, call +1 (555) 123-4567.';
        } else if (lowerMessage.includes('booking') || lowerMessage.includes('registration')) {
            return 'Your bookings and registrations can be found in the My Bookings section. You can see all your confirmed events and workshops there.';
        } else if (lowerMessage.includes('wifi') || lowerMessage.includes('password')) {
            return 'The Wi-Fi network is "TechHack2025" and the password is "TechHack2025". You can find this information in the Help & Support section as well.';
        } else if (lowerMessage.includes('food') || lowerMessage.includes('lunch') || lowerMessage.includes('dinner')) {
            return 'The food court is open 24/7 on the 2nd floor. Coffee stations are available on all floors. Extended lunch break is from 1:00 PM - 2:00 PM.';
        } else if (lowerMessage.includes('location') || lowerMessage.includes('venue')) {
            return 'The hackathon is taking place at Tech Innovation Center, San Francisco. You can find venue navigation in your dashboard.';
        } else {
            return 'Thanks for your message! I\'m here to help with any questions about the hackathon. You can ask me about events, venue information, bookings, or technical support.';
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const fileNote = `Sent a file: ${file.name}`;
            addMessage({
                id: Date.now().toString(),
                content: fileNote,
                sender: 'user',
                timestamp: new Date(),
                attachmentUrl: URL.createObjectURL(file),
                attachmentType: file.type,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        addMessage(newMessage);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Simulate bot response delay
            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    content: generateBotResponse(newMessage.content),
                    sender: 'bot',
                    timestamp: new Date(),
                };
                addMessage(botResponse);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error in chat interaction:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date(),
            };
            addMessage(errorMessage);
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    const handleClose = () => {
        setIsChatOpen(false);
        onClose?.();
    };

    if (!isChatOpen) {
        return (
            <button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 bg-[#E63946] text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity z-50"
                aria-label="Open chat"
            >
                <MessageCircle size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-black text-white rounded-lg shadow-xl flex flex-col border border-gray-800 z-50">
            {/* Chat Header */}
            <div className="bg-[#E63946] text-white p-4 rounded-t-lg flex justify-between items-center">
                <h2 className="font-semibold">Chat Support</h2>
                <button onClick={handleClose} className="hover:text-gray-200">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                                message.sender === 'user'
                                    ? 'bg-[#E63946] text-white'
                                    : 'bg-gray-900 text-white'
                            }`}
                        >
                            <p>{message.content}</p>
                            {message.attachmentUrl && (
                                <div className="mt-2">
                                    {message.attachmentType?.startsWith('image/') ? (
                                        <img 
                                            src={message.attachmentUrl} 
                                            alt="Attached image" 
                                            className="max-w-full rounded"
                                        />
                                    ) : (
                                        <a 
                                            href={message.attachmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#E63946] underline"
                                        >
                                            View Attachment
                                        </a>
                                    )}
                                </div>
                            )}
                            <span className="text-xs opacity-75 mt-1 block">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-900 text-white p-3 rounded-lg">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-800 p-4 bg-black">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowEmojis(!showEmojis)}
                        className="p-2 text-white hover:opacity-90"
                        aria-label="Toggle emojis"
                    >
                        😊
                    </button>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-700 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-400 focus:outline-none focus:border-[#E63946]"
                        disabled={isLoading}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf,.doc,.docx"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-white hover:opacity-90"
                        aria-label="Attach file"
                    >
                        <Paperclip size={20} />
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="bg-[#E63946] text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-40"
                    >
                        <Send size={20} />
                    </button>
                </div>
                {showEmojis && (
                    <div className="absolute bottom-20 right-4 bg-white shadow-lg rounded-lg p-2">
                        <div className="grid grid-cols-8 gap-1">
                            {["😊", "👍", "🎉", "❤️", "😂", "🙌", "🤔", "👋"].map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        setInputMessage(prev => prev + emoji);
                                        setShowEmojis(false);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded text-black"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;