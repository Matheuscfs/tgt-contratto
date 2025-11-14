import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { getSupabase } from '../lib/supabase'

interface ClientQuotesPageProps {}

const statusConfig = {
    Enviado: {
        icon: PaperAirplaneIcon,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
    },
    Respondido: {
        icon: ClockIcon,
        color: 'text-orange-500',
        bgColor: 'bg-orange-100',
    },
    Concluído: {
        icon: CheckCircleIcon,
        color: 'text-green-500',
        bgColor: 'bg-green-100',
    },
};

const ClientQuotesPage: React.FC<ClientQuotesPageProps> = () => {
    const [quotes, setQuotes] = useState<any[]>([])
    useEffect(() => {
        const load = async () => {
            try {
                const supabase = getSupabase()
                const { data: user } = await supabase.auth.getUser()
                const uid = user.user?.id
                if (!uid) return
                const { data } = await supabase
                  .from('quotes')
                  .select('id, service, status, created_at, companies(company_name)')
                  .eq('user_id', uid)
                  .order('created_at', { ascending: false })
                setQuotes(data ?? [])
            } catch {}
        }
        load()
    }, [])
    return (
        <div className="bg-gray-50 min-h-screen">
             <header className="bg-white shadow-sm sticky top-0 z-20">
                 <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => history.back()} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Meus Orçamentos</h1>
                 </div>
            </header>
            <main className="container mx-auto p-4">
                <div className="space-y-4">
                    {quotes.map((quote: any) => {
                        const { icon: Icon, color, bgColor } = statusConfig[quote.status as keyof typeof statusConfig] || statusConfig.Enviado;
                        return (
                             <button 
                                key={quote.id} 
                                onClick={() => {}}
                                className="w-full text-left bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary transition-transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div>
                                        <p className="font-bold text-lg text-gray-800">{quote.companies?.company_name ?? 'Empresa'}</p>
                                        <p className="text-sm text-gray-600">{quote.service}</p>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                                        <div className={`flex items-center gap-2 text-sm font-semibold py-1 px-2.5 rounded-full self-start ${bgColor} ${color}`}>
                                            <Icon className="h-4 w-4" />
                                            <span>{quote.status}</span>
                                        </div>
                                         <p className="text-xs text-gray-400 mt-1">{new Date(quote.created_at).toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </main>
        </div>
    );
};

export default ClientQuotesPage;
