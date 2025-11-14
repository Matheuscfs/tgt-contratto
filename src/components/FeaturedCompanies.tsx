import React from 'react';
import { Company } from '../types/domain';
import CompanyCard from './CompanyCard';
import { StarIcon } from '@heroicons/react/24/solid';

interface FeaturedCompaniesProps {
    companies: Company[];
    onSelectCompany: (company: Company) => void;
    onToggleFavorite: (companyId: string) => void;
}

const FeaturedCompanies: React.FC<FeaturedCompaniesProps> = ({ companies, onSelectCompany, onToggleFavorite }) => {
    if (companies.length === 0) return null;
    
    return (
        <section className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <StarIcon className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold">Empresas em Destaque</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {companies.map(company => (
                    <CompanyCard
                        key={company.id}
                        company={company}
                        onClick={() => onSelectCompany(company)}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedCompanies;
