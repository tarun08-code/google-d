import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Paperclip } from 'lucide-react';
import { useChat } from '../context/ChatContext';

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
    // messages are stored in ChatContext
    const [inputMessage, setInputMessage] = useState('');
    // loading state lives in context
    const [isChatOpen, setIsChatOpen] = useState(isOpen);
    const [showEmojis, setShowEmojis] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { state, sendMessage, addMessage } = useChat();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [state.messages]);

    useEffect(() => {
        setIsChatOpen(isOpen);
    }, [isOpen]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // In this simplified version, we do not upload attachments externally.
            const fileNote = `Sent a file: ${file.name}`;
            // Add user file note to chat
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
            // nothing local to reset
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

        setInputMessage('');

        try {
            await sendMessage(newMessage.content);
        } catch (error) {
            console.error('Error in chat interaction:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date(),
            };
            addMessage(errorMessage);
        } finally {
            // nothing local to reset
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
                className="fixed bottom-4 right-4 bg-[#E63946] text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
                aria-label="Open chat"
            >
                <MessageCircle size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-black text-white rounded-lg shadow-xl flex flex-col border border-gray-800">
            {/* Chat Header */}
            <div className="bg-[#E63946] text-white p-4 rounded-t-lg flex justify-between items-center">
                <h2 className="font-semibold">Chat Support</h2>
                <button onClick={handleClose} className="hover:text-gray-200">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state.messages.map((message) => (
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
                {state.isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
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
                {/* optional smart replies removed in simplified version */}
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
                        disabled={state.isLoading}
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
                        disabled={state.isLoading}
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
                                    className="p-1 hover:bg-gray-100 rounded"
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