import React from 'react'
import { Company } from '../types/domain'
import { StarIcon, HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface CompanyCardProps {
  company: Company
  onClick: () => void
  onToggleFavorite: (companyId: string) => void
}

export default function CompanyCard({ company, onClick, onToggleFavorite }: CompanyCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(company.id)
  }

  return (
    <div onClick={onClick} className="bg-white rounded-lg overflow-hidden border border-gray-200/80 hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      <div className="relative">
        <img src={company.coverUrl} alt={`${company.name} cover`} className="w-full h-32 object-cover" />
        <button onClick={handleFavoriteClick} className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
          {company.isFavorite ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartOutlineIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-3">
          <img src={company.logoUrl} alt={`${company.name} logo`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm -mt-8" />
          <div>
            <h3 className="text-md font-bold truncate group-hover:text-primary">{company.name}</h3>
            <p className="text-xs text-gray-500">{company.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
          <StarIcon className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-yellow-600">{company.rating.toFixed(1)}</span>
          <span className="text-gray-400">•</span>
          <span>{company.reviewCount} avaliações</span>
        </div>
      </div>
    </div>
  )
}
