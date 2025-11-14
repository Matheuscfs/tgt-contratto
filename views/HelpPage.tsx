import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon, ChevronDownIcon, ChatBubbleBottomCenterTextIcon, LifebuoyIcon } from '@heroicons/react/24/outline';

interface HelpPageProps {
    onBack: () => void;
}

const FAQ_DATA = [
    { q: 'Como edito o perfil da minha empresa?', a: 'Você pode editar seu perfil na tela de "Perfil", clicando na opção "Editar Perfil". Lá você poderá alterar nome, descrição, fotos e outras informações.' },
    { q: 'Como funciona o sistema de planos?', a: 'Oferecemos diferentes planos com vantagens exclusivas. Você pode gerenciar sua assinatura, trocar de plano ou cancelar a qualquer momento na seção "Planos e Assinatura".' },
    { q: 'Como responder a um orçamento?', a: 'Vá para a seção "Orçamentos" no seu perfil. Na aba "Solicitados", você verá todos os novos pedidos. Clique em "Responder" para enviar sua proposta.' },
    { q: 'Minha empresa não aparece nas buscas. O que fazer?', a: 'Certifique-se de que seu perfil está completo, com descrição, serviços e fotos de portfólio. Perfis mais completos têm melhor posicionamento. Se o problema persistir, entre em contato com nosso suporte.' },
];

const FaqItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50">
                <span className="font-semibold text-gray-800">{question}</span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 pt-0 text-gray-600">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Ajuda e Suporte</h1>
                </div>
            </header>
            <main className="container mx-auto p-4">
                <div className="relative mb-6">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Como podemos ajudar?"
                        className="w-full bg-white border border-gray-300 rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-lg font-bold p-4 border-b">Perguntas Frequentes</h2>
                    <div>
                        {FAQ_DATA.map(faq => <FaqItem key={faq.q} question={faq.q} answer={faq.a} />)}
                    </div>
                </div>

                <div className="mt-8">
                     <h2 className="text-lg font-bold mb-4 text-center">Ainda precisa de ajuda?</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                             <ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-primary mb-2" />
                             <span className="font-bold text-gray-800">Chat Online</span>
                             <span className="text-sm text-gray-500">Fale com um atendente</span>
                        </button>
                         <button className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                             <LifebuoyIcon className="h-10 w-10 text-primary mb-2" />
                             <span className="font-bold text-gray-800">Abrir Ticket</span>
                             <span className="text-sm text-gray-500">Retornamos em até 24h</span>
                        </button>
                     </div>
                </div>
            </main>
        </div>
    );
};

export default HelpPage;
