import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon, PencilIcon, DocumentTextIcon, StarIcon } from '@heroicons/react/24/outline';

interface MyClientProfilePageProps {
    onBack: () => void;
    onNavigate: (view: 'clientSettings') => void;
    userName: string;
    userEmail: string;
}

const StatItem: React.FC<{ icon: React.ElementType, value: string, label: string }> = ({ icon: Icon, value, label }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg text-center">
        <Icon className="h-8 w-8 text-primary mb-2" />
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
    </div>
);


const MyClientProfilePage: React.FC<MyClientProfilePageProps> = ({ onBack, onNavigate, userName, userEmail }) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Meu Perfil</h1>
                </div>
            </header>
            <main className="container mx-auto p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                            <UserCircleIcon className="h-16 w-16" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{userName}</h2>
                        <p className="text-gray-500">{userEmail}</p>
                        <button 
                            onClick={() => onNavigate('clientSettings')}
                            className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary py-2 px-4 rounded-md border border-primary/50 hover:bg-primary/10 transition-colors"
                        >
                            <PencilIcon className="h-4 w-4" />
                            Editar Perfil
                        </button>
                    </div>

                    <div className="mt-8">
                         <h3 className="text-lg font-semibold text-gray-700 mb-4">Minhas Atividades</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <StatItem icon={DocumentTextIcon} value="4" label="Orçamentos Enviados" />
                            <StatItem icon={StarIcon} value="2" label="Avaliações Feitas" />
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyClientProfilePage;
