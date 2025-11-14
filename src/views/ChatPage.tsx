import React, { useState, useEffect, useRef } from 'react';
import { listMessages, sendMessage, subscribeMessages } from '../features/chat/api'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface ChatPageProps {}

const ChatBubble: React.FC<{ message: any }> = ({ message }) => {
    const isUser = message.sender === 'client';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isUser ? 'bg-primary text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                <p>{message.text}</p>
                 <p className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70 text-right' : 'text-gray-500 text-left'}`}>
                    {message.timestamp}
                </p>
            </div>
        </div>
    );
};

const ChatPage: React.FC<ChatPageProps> = () => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        const load = async () => {
            if (id) {
                const msgs = await listMessages(id)
                setMessages(msgs)
            }
        }
        load()
        if (id) {
            const sub = subscribeMessages(id, (m) => {
                setMessages((prev) => [...prev, m])
            })
            return () => { sub.unsubscribe?.() }
        }
    }, [id])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && id) {
            sendMessage(id, 'client', newMessage.trim())
            setNewMessage('');
        }
    };

    return (
        <div className="bg-gray-50 flex flex-col h-screen">
             <header className="bg-white shadow-sm shrink-0 z-10">
                 <div className="container mx-auto px-4 py-3 flex items-center gap-3">
                     <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <div className="font-bold text-lg">Chat</div>
                 </div>
            </header>

             <main className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {messages.map(msg => (
                        <ChatBubble key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            
            <footer className="bg-white border-t p-2 shrink-0">
                <div className="container mx-auto px-2">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <button type="button" onClick={() => alert('Anexar arquivo (em breve)')} className="text-gray-500 hover:text-primary rounded-full p-3 flex-shrink-0 focus:outline-none">
                            <PaperClipIcon className="h-6 w-6" />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite uma mensagem..."
                            className="flex-1 w-full bg-gray-100 border-transparent rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button type="submit" className="bg-primary text-white rounded-full p-3 flex-shrink-0 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <PaperAirplaneIcon className="h-6 w-6" />
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;
