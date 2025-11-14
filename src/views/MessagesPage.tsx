import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import BottomNavBar from '../components/BottomNavBar'

interface MessagesPageProps {}

const ConversationListItem: React.FC<{ conversation: any; onClick: () => void }> = ({ conversation, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors">
        <div className="relative flex-shrink-0">
            <img src={conversation.companyLogoUrl || ''} alt={conversation.companyName || ''} className="w-14 h-14 rounded-full" />
            {conversation.unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-primary ring-2 ring-white text-white text-xs flex items-center justify-center font-bold">
                    {conversation.unreadCount}
                </span>
            )}
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 truncate">{conversation.companyName || 'Conversa'}</h3>
                <p className={`text-xs ${conversation.unreadCount > 0 ? 'text-primary font-bold' : 'text-gray-500'}`}>
                    {conversation.timestamp}
                </p>
            </div>
            <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                {conversation.lastMessage}
            </p>
        </div>
    </button>
);


const MessagesPage: React.FC<MessagesPageProps> = () => {
    const [conversations, setConversations] = useState<any[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        const load = async () => {
            try {
                const supabase = getSupabase()
                const { data: user } = await supabase.auth.getUser()
                const uid = user.user?.id
                if (!uid) return
                const { data } = await supabase.from('conversations').select('*').or(`client_id.eq.${uid},company_id.eq.${uid}`).order('created_at', { ascending: false })
                setConversations(data ?? [])
            } catch {}
        }
        load()
    }, [])
    return (
        <div className="h-full flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                 <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-primary">Mensagens</h1>
                     <div className="relative mt-4">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar conversas"
                            className="w-full bg-gray-100 border border-transparent rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                 </div>
            </header>
            <main className="flex-1 container mx-auto p-4">
                 {conversations.length > 0 ? (
                    <div className="space-y-2">
                        {conversations.map(conv => (
                            <ConversationListItem key={conv.id} conversation={conv} onClick={() => navigate(`/chat/${conv.id}`)} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-20">
                        <h2 className="text-xl font-semibold text-gray-800">Nenhuma mensagem</h2>
                        <p className="mt-2 text-gray-500">
                           Inicie uma conversa na página de uma empresa.
                        </p>
                    </div>
                )}
            </main>
            <BottomNavBar activeView={'messages'} onNavigate={(v) => {
                if (v === 'home') navigate('/home')
                if (v === 'explore') navigate('/explore')
                if (v === 'messages') navigate('/messages')
                if (v === 'profile') navigate('/profile')
            }} />
        </div>
    );
};

export default MessagesPage;
