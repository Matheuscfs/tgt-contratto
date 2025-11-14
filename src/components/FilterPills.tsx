import React from 'react';
import { AdjustmentsHorizontalIcon, MapPinIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/outline';

const FILTERS = [
    { label: 'Ordenar', icon: AdjustmentsHorizontalIcon },
    { label: 'Localização', icon: MapPinIcon },
    { label: 'Preço', icon: CurrencyDollarIcon },
    { label: 'Avaliação', icon: StarIcon },
];

const FilterPills: React.FC = () => {
    return (
        <div className="py-2">
            {/* FIX: Use camelCase for CSS properties in React style objects. */}
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {FILTERS.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        className="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterPills;
