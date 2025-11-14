import React from 'react';
import { Category } from '../types';

interface CategoryGridProps {
    categories: Category[];
    onSelectCategory: (category: Category) => void;
    onSelectAll: () => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory, onSelectAll }) => {
    return (
        <div className="py-4">
            {/* FIX: Use camelCase for CSS properties in React style objects. */}
            <div className="flex space-x-4 overflow-x-auto pb-3 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category)}
                        className="flex flex-col items-center justify-start space-y-2 flex-shrink-0 w-20 text-center group"
                    >
                        <div className="w-16 h-16 rounded-full flex items-center justify-center p-3 transition-colors group-hover:bg-gray-100">
                            <category.icon className="h-full w-full text-gray-700" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{category.name}</span>
                    </button>
                ))}
                 <button
                    onClick={onSelectAll}
                    className="flex flex-col items-center justify-start space-y-2 flex-shrink-0 w-20 text-center group"
                >
                     <div className="w-16 h-16 rounded-full flex items-center justify-center p-3 transition-colors group-hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-gray-700"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                     </div>
                    <span className="text-xs font-medium text-gray-600">Todas</span>
                </button>
            </div>
        </div>
    );
};

export default CategoryGrid;