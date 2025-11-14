import React, { useState, useMemo, useEffect } from 'react';
import { getSupabase } from '../lib/supabase'
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface CompanyQuotesPageProps {}

type Tab = 'Solicitados' | 'Respondidos' | 'Em Andamento' | 'Finalizados';

const TABS: Tab[] = ['Solicitados', 'Respondidos', 'Em Andamento', 'Finalizados'];
const STATUS_MAP: Record<Tab, string[]> = {
    'Solicitados': ['Solicitado'],
    'Respondidos': ['Respondido'],
    'Em Andamento': ['Em Andamento'],
    'Finalizados': ['Finalizado', 'Concluído'], // Mapping 'Concluído' for compatibility
};

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; count: number; }> = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`relative flex-1 py-3 px-2 text-sm font-semibold transition-colors text-center ${
            isActive ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {label}
        {count > 0 && (
            <span className={`absolute top-2 right-1 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {count}
            </span>
        )}
    </button>
);

const QuoteItem: React.FC<{ quote: any }> = ({ quote }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200/80">
        <div className="flex items-start gap-4">
            <img src={quote.userAvatarUrl} alt={quote.userName} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">{quote.users?.name ?? 'Cliente'}</h3>
                    <p className="text-xs text-gray-400">{new Date(quote.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <p className="text-sm font-semibold text-primary">{quote.service}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{quote.company_response_message ?? ''}</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t flex justify-end gap-2">
            <button className="text-sm font-semibold text-primary py-2 px-4 rounded-md hover:bg-primary/10 transition-colors">
                Ver Detalhes
            </button>
            {quote.status === 'Solicitado' && (
                 <button className="text-sm font-semibold text-white bg-primary py-2 px-4 rounded-md hover:bg-primary-hover transition-colors">
                    Responder
                </button>
            )}
        </div>
    </div>
);


const CompanyQuotesPage: React.FC<CompanyQuotesPageProps> = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Solicitados');
    const [quotes, setQuotes] = useState<any[]>([])

    useEffect(() => {
        const load = async () => {
            try {
                const supabase = getSupabase()
                const { data: user } = await supabase.auth.getUser()
                const uid = user.user?.id
                if (!uid) return
                const { data: companies } = await supabase.from('companies').select('id').eq('owner_user_id', uid).limit(1)
                const companyId = companies?.[0]?.id
                if (!companyId) return
                const { data } = await supabase
                  .from('quotes')
                  .select('id, service, status, created_at, users(name), user_id')
                  .eq('company_id', companyId)
                  .order('created_at', { ascending: false })
                setQuotes(data ?? [])
            } catch {}
        }
        load()
    }, [])

    const filteredQuotes = useMemo(() => {
        const statuses = STATUS_MAP[activeTab];
        return quotes.filter(quote => statuses.includes(quote.status));
    }, [quotes, activeTab]);

    const quoteCounts = useMemo(() => {
        return TABS.reduce((acc, tab) => {
            const statuses = STATUS_MAP[tab];
            acc[tab] = quotes.filter(quote => statuses.includes(quote.status)).length;
            return acc;
        }, {} as Record<Tab, number>);
    }, [quotes]);


    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => history.back()} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Gerenciar Orçamentos</h1>
                </div>
                <div className="container mx-auto px-2 flex">
                    {TABS.map(tab => (
                        <TabButton 
                            key={tab}
                            label={tab}
                            isActive={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                            count={quoteCounts[tab]}
                        />
                    ))}
                </div>
            </header>
            <main className="container mx-auto p-4">
                {filteredQuotes.length > 0 ? (
                    <div className="space-y-4">
                        {filteredQuotes.map(quote => (
                            <QuoteItem key={quote.id} quote={quote} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                         <h2 className="text-xl font-semibold text-gray-700">Nenhum orçamento aqui</h2>
                        <p className="mt-2 text-gray-500">
                            Não há orçamentos com o status "{activeTab}" no momento.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CompanyQuotesPage;
