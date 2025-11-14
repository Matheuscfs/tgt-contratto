import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { BellIcon, ChatBubbleBottomCenterTextIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { getNotifications } from '../features/notifications/api'

interface NotificationsPageProps {
    onBack: () => void;
}

type UIIcon = typeof ChatBubbleBottomCenterTextIcon | typeof PhotoIcon | typeof SparklesIcon

function mapTypeToIcon(t: string): UIIcon {
  if (t === 'portfolio') return PhotoIcon
  if (t === 'recommendation') return SparklesIcon
  return ChatBubbleBottomCenterTextIcon
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
    const [items, setItems] = useState<any[]>([])
    useEffect(() => {
        getNotifications().then((rows) => {
            const mapped = rows.map((n: any) => ({
                id: n.id,
                icon: mapTypeToIcon(n.type),
                iconColor: 'text-blue-500',
                bgColor: 'bg-blue-100',
                title: n.title,
                description: n.description,
                time: new Date(n.created_at).toLocaleString('pt-BR'),
                isNew: n.is_new,
            }))
            setItems(mapped)
        }).catch(() => setItems([]))
    }, [])
    return (
        <div className="bg-gray-50 min-h-screen">
             <header className="bg-white shadow-sm sticky top-0 z-20">
                 <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                     <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Notificações</h1>
                 </div>
            </header>
            <main className="container mx-auto p-4">
                {items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map(notification => (
                             <div key={notification.id} className={`bg-white rounded-lg p-4 flex items-start gap-4 shadow-sm transition-colors hover:bg-gray-50 cursor-pointer ${notification.isNew ? 'border-l-4 border-primary' : ''}`}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.bgColor}`}>
                                    <notification.icon className={`h-6 w-6 ${notification.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{notification.title}</p>
                                    <p className="text-sm text-gray-600">{notification.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {notification.isNew && (
                                    <div className="w-2.5 h-2.5 bg-primary rounded-full self-center flex-shrink-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BellIcon className="mx-auto h-16 w-16 text-gray-300" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-800">Sem notificações</h2>
                        <p className="mt-2 text-gray-500">
                            Você não tem nenhuma notificação nova no momento.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotificationsPage;
