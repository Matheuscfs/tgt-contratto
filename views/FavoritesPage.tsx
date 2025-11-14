import React from 'react';
import { Company } from '../types';
import CompanyCard from '../components/CompanyCard';
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/solid';

interface FavoritesPageProps {
    companies: Company[];
    onBack: () => void;
    onSelectCompany: (company: Company) => void;
    onToggleFavorite: (companyId: string) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ companies, onBack, onSelectCompany, onToggleFavorite }) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Meus Favoritos</h1>
                </div>
            </header>
            <main className="container mx-auto p-4">
                {companies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {companies.map(company => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onClick={() => onSelectCompany(company)}
                                onToggleFavorite={onToggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <HeartIcon className="mx-auto h-16 w-16 text-gray-300" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-800">Nenhuma empresa favorita</h2>
                        <p className="mt-2 text-gray-500">
                            Clique no ícone de coração para salvar suas empresas preferidas aqui.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;
