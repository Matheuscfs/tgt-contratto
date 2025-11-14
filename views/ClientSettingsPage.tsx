
import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface ClientSettingsPageProps {
    onBack: () => void;
    userName: string;
}

const ClientSettingsPage: React.FC<ClientSettingsPageProps> = ({ onBack, userName }) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Perfil atualizado com sucesso!');
        onBack();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
             <header className="bg-white shadow-sm sticky top-0 z-20">
                 <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                     <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Configurar Perfil</h1>
                 </div>
            </header>
            <main className="container mx-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input type="text" id="name" defaultValue={userName} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                            <input type="email" id="email" defaultValue="ana.carolina@email.com" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <hr />
                         <div>
                            {/* FIX: Corrected typo `cla ssName` to `className` */}
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Senha Atual</label>
                            <input type="password" id="current-password" placeholder="Deixe em branco para não alterar" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                         <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                            <input type="password" id="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ClientSettingsPage;