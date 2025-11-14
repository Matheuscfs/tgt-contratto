import React from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const TRENDING_SERVICES = [
    'Logo para Startup',
    'Gestão de Instagram',
    'Reforma de Cozinha',
    'Site Institucional',
    'Edição de Vídeo',
    'Consultoria Financeira'
];

const TrendingServices: React.FC = () => {
    return (
        <section className="my-8">
            <div className="flex items-center gap-2 mb-4">
                <ArrowTrendingUpIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Serviços em Alta</h2>
            </div>
            <div className="flex flex-wrap gap-3">
                {TRENDING_SERVICES.map(service => (
                    <button key={service} className="bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-gray-200 transition-colors">
                        {service}
                    </button>
                ))}
            </div>
        </section>
    )
};

export default TrendingServices;
