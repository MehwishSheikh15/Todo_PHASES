'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, User, Bot } from 'lucide-react';
import API_CONFIG from '@/lib/api-config';
import { format } from 'date-fns';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
    action?: string;
}

export default function HistoryPage() {
    const { isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!isAuthenticated) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_CONFIG.BASE_URL}/chat/history`, {
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Group messages by date
    const groupedMessages: { [date: string]: ChatMessage[] } = {};
    messages.forEach(msg => {
        const date = new Date(msg.timestamp).toLocaleDateString();
        if (!groupedMessages[date]) groupedMessages[date] = [];
        groupedMessages[date].push(msg);
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Chat History</h1>
                    <p className="text-gray-500">View past conversations with the AI assistant</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No chat history found</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-8">
                        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                            <div key={date}>
                                <div className="flex items-center justify-center mb-4">
                                    <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
                                        {date}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {dateMessages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                                                    }`}>
                                                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                                </div>
                                                <div className={`p-3 rounded-lg ${msg.sender === 'user'
                                                        ? 'bg-blue-500 text-white rounded-tr-none'
                                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                                    }`}>
                                                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                                    <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                                                        }`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
