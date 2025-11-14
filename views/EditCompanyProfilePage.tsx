import React, { useState } from 'react';
import { Company } from '../types';
import { ArrowLeftIcon, CameraIcon } from '@heroicons/react/24/solid';

interface EditCompanyProfilePageProps {
    company: Company;
    onBack: () => void;
    onSave: (updatedCompany: Company) => void;
}

const EditCompanyProfilePage: React.FC<EditCompanyProfilePageProps> = ({ company, onBack, onSave }) => {
    const [formData, setFormData] = useState(company);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary";

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Editar Perfil da Empresa</h1>
                </div>
            </header>

            <main className="container mx-auto p-4 pb-20">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                    {/* Image Fields */}
                    <div>
                        <div className="relative h-48 rounded-lg bg-gray-200">
                            <img src={formData.coverUrl} alt="Capa" className="w-full h-full object-cover rounded-lg" />
                            <label htmlFor="cover-upload" className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/60 text-white text-xs font-semibold py-1 px-2 rounded-md cursor-pointer hover:bg-black/80">
                                <CameraIcon className="h-4 w-4" />
                                Alterar Capa
                            </label>
                            <input id="cover-upload" type="file" className="sr-only" />
                        </div>
                        <div className="relative -mt-12 ml-6 w-24 h-24 rounded-full border-4 border-white">
                             <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                             <label htmlFor="logo-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                <CameraIcon className="h-6 w-6" />
                             </label>
                             <input id="logo-upload" type="file" className="sr-only" />
                        </div>
                    </div>

                    {/* Text Fields */}
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                        
                        {/* Address Fields */}
                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">Endereço</legend>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">Logradouro</label>
                                    <input type="text" name="street" id="street" value={formData.location.street} onChange={handleAddressChange} className={inputClass} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número</label>
                                    <input type="text" name="number" id="number" value={formData.location.number} onChange={handleAddressChange} className={inputClass} />
                                </div>
                                 <div className="sm:col-span-3">
                                    <label htmlFor="complement" className="block text-sm font-medium text-gray-700">Complemento <span className="text-gray-400">(Opcional)</span></label>
                                    <input type="text" name="complement" id="complement" value={formData.location.complement || ''} onChange={handleAddressChange} className={inputClass} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro</label>
                                    <input type="text" name="neighborhood" id="neighborhood" value={formData.location.neighborhood} onChange={handleAddressChange} className={inputClass} />
                                </div>
                                <div className="sm:col-span-4">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
                                    <input type="text" name="city" id="city" value={formData.location.city} onChange={handleAddressChange} className={inputClass} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                                    <input type="text" name="state" id="state" value={formData.location.state} onChange={handleAddressChange} className={inputClass} />
                                </div>
                            </div>
                        </fieldset>
                        
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                className={inputClass}
                            ></textarea>
                        </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-2">
                         <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditCompanyProfilePage;