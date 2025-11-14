import React from 'react'
import { getSupabase } from '../lib/supabase'
import { XMarkIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyName: string;
    serviceName?: string;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, companyName, serviceName }) => {
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const name = String(form.get('name') || '')
        const email = String(form.get('email') || '')
        const service = String(form.get('service') || '')
        const description = String(form.get('description') || '')
        try {
            const supabase = getSupabase()
            await supabase.from('quotes').insert({
                client_name: name,
                client_email: email,
                company_name: companyName,
                service_name: service,
                description,
                status: 'Solicitado',
            })
            onClose()
        } catch {
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Solicitar Orçamento para <span className="text-primary">{companyName}</span></h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Seu Nome</label>
                            <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Seu E-mail</label>
                            <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Serviço Desejado</label>
                            <input type="text" id="service" name="service" defaultValue={serviceName || ''} placeholder="Ex: Reforma de cozinha, Gestão de Instagram" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição do Projeto</label>
                            <textarea id="description" name="description" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Descreva o que você precisa com o máximo de detalhes possível..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Anexar Imagens (Opcional)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                            <span>Carregar um arquivo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                        </label>
                                        <p className="pl-1">ou arraste e solte</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 text-right">
                        <button type="button" onClick={onClose} className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Cancelar
                        </button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Enviar Solicitação
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteModal;
