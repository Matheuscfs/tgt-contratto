import React from 'react';
import { Quote } from '../types';
import { ArrowLeftIcon, ChatBubbleOvalLeftEllipsisIcon, CheckCircleIcon, StarIcon, XCircleIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

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

interface QuoteDetailsPageProps {
    quote: Quote;
    onBack: () => void;
    onStartChat: (companyId: string) => void;
}

const DetailSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const QuoteDetailsPage: React.FC<QuoteDetailsPageProps> = ({ quote, onBack, onStartChat }) => {
    const { icon: StatusIcon, color, bgColor } = statusConfig[quote.status];

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Detalhes do Orçamento</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 space-y-6 pb-20">
                <DetailSection title="Resumo da Solicitação">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Empresa</p>
                            <p className="font-semibold text-gray-800">{quote.companyName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Serviço</p>
                            <p className="font-semibold text-gray-800">{quote.service}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Data da Solicitação</p>
                            <p className="font-semibold text-gray-800">{quote.date}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Status</p>
                             <div className={`inline-flex items-center gap-2 font-semibold py-1 px-2.5 rounded-full ${bgColor} ${color}`}>
                                <StatusIcon className="h-4 w-4" />
                                <span>{quote.status}</span>
                            </div>
                        </div>
                    </div>
                </DetailSection>

                <DetailSection title="Sua Solicitação">
                     <p className="text-gray-600 whitespace-pre-wrap">{quote.userRequestDetails}</p>
                </DetailSection>

                {quote.status === 'Enviado' && (
                     <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-r-lg" role="alert">
                        <p className="font-bold">Aguardando Resposta</p>
                        <p>A empresa foi notificada e responderá em breve. Você receberá uma notificação assim que houver uma atualização.</p>
                    </div>
                )}
                
                {quote.status === 'Respondido' && quote.companyResponse && (
                    <DetailSection title="Resposta da Empresa">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Mensagem</p>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{quote.companyResponse.message}</p>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-sm text-gray-500">Preço Proposto</p>
                                    <p className="font-bold text-lg text-primary">{quote.companyResponse.price}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Prazo Estimado</p>
                                    <p className="font-semibold text-gray-800">{quote.companyResponse.estimatedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-6 border-t pt-4">
                            <button onClick={() => onStartChat(quote.companyId)} className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold py-3 px-4 rounded-lg hover:bg-secondary-hover transition-colors">
                                <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5"/>
                                Enviar Mensagem
                            </button>
                             <button onClick={() => alert('Proposta aceita! A empresa será notificada.')} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                                <CheckCircleIcon className="h-5 w-5"/>
                                Aceitar Proposta
                            </button>
                             <button onClick={() => alert('Proposta recusada.')} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                <XCircleIcon className="h-5 w-5"/>
                                Recusar
                            </button>
                        </div>
                    </DetailSection>
                )}

                {quote.status === 'Concluído' && quote.finalDetails && (
                     <DetailSection title="Histórico do Serviço">
                         <div className={`p-4 rounded-lg ${quote.finalDetails.wasAccepted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                            <p className={`font-bold text-lg ${quote.finalDetails.wasAccepted ? 'text-green-700' : 'text-red-700'}`}>
                                {quote.finalDetails.wasAccepted ? 'Negócio Fechado' : 'Proposta Recusada'}
                            </p>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Preço Final</p>
                                <p className="font-bold text-lg text-primary">{quote.finalDetails.finalPrice}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">Data de Conclusão</p>
                                <p className="font-semibold text-gray-800">{quote.finalDetails.conclusionDate}</p>
                            </div>
                         </div>
                         {quote.finalDetails.feedback && (
                            <div>
                                <p className="text-sm text-gray-500">Seu Feedback</p>
                                <p className="text-gray-700 italic bg-gray-50 p-3 rounded-md">"{quote.finalDetails.feedback}"</p>
                            </div>
                         )}
                         <div className="mt-6 border-t pt-4">
                             <button onClick={() => alert('Avaliar serviço (em breve).')} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                                <StarIcon className="h-5 w-5"/>
                                {quote.finalDetails.feedback ? 'Ver/Editar Avaliação' : 'Avaliar Serviço'}
                            </button>
                         </div>
                    </DetailSection>
                )}
            </main>
        </div>
    );
};

export default QuoteDetailsPage;
