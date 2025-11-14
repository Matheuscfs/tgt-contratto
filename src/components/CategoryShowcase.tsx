import React from 'react';
import { Category } from '../types/domain';

interface CategoryShowcaseProps {
    categories: Category[];
    onSelectCategory: (category: Category) => void;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories, onSelectCategory }) => {
    return (
        <section className="mt-4">
            <h2 className="text-xl font-bold mb-3">Categorias</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map(category => (
                    <button 
                        key={category.id} 
                        onClick={() => onSelectCategory(category)}
                        className="relative rounded-lg overflow-hidden h-24 cursor-pointer group text-left w-full"
                    >
                        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 p-3 flex items-end">
                            <h3 className="text-white font-bold text-md">{category.name}</h3>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;
