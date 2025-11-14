import React, { useState, useMemo, useEffect } from 'react'
import { Company, Category } from '../types/domain'
import CompanyCard from '../components/CompanyCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import FilterPills from '../components/FilterPills'
import CategoryShowcase from '../components/CategoryShowcase'
import BottomNavBar from '../components/BottomNavBar'
import { useNavigate } from 'react-router-dom'

interface ExplorePageProps {
  companies?: Company[]
  categories?: Category[]
  onSelectCompany?: (company: Company) => void
  onToggleFavorite?: (companyId: string) => void
  initialCategory?: Category | null
  onClearInitialCategory?: () => void
}

export default function ExplorePage({ companies = [], categories = [], onSelectCompany = () => {}, onToggleFavorite = () => {}, initialCategory = null, onClearInitialCategory = () => {} }: ExplorePageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory)
  const navigate = useNavigate()

  useEffect(() => { setSelectedCategory(initialCategory) }, [initialCategory])

  const filteredCompaniesBySearch = useMemo(() => {
    return companies.filter(company => {
      const s = searchTerm.toLowerCase()
      return s === '' || company.name.toLowerCase().includes(s) || company.services.some(x => x.name.toLowerCase().includes(s)) || company.category.toLowerCase().includes(s)
    })
  }, [companies, searchTerm])

  const companiesForCategory = useMemo(() => {
    if (!selectedCategory) return []
    return companies.filter(c => (c as any).categoryId === selectedCategory.id)
  }, [companies, selectedCategory])

  const handleSelectCategory = (category: Category) => { setSelectedCategory(category); setSearchTerm('') }
  const handleClearCategory = () => { setSelectedCategory(null); onClearInitialCategory() }

  const nav = (v: any) => {
    if (v === 'home') navigate('/home')
    if (v === 'explore') navigate('/explore')
    if (v === 'messages') navigate('/messages')
    if (v === 'profile') navigate('/profile')
  }

  if (selectedCategory) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <header className="flex items-center gap-4 mb-4">
          <button onClick={handleClearCategory} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{selectedCategory.name}</h1>
        </header>
        {companiesForCategory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companiesForCategory.map(company => (
              <CompanyCard key={company.id} company={company} onClick={() => onSelectCompany(company)} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12"><p className="text-gray-500">Nenhuma empresa encontrada nesta categoria.</p></div>
        )}
        <BottomNavBar activeView={'explore'} onNavigate={nav} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input type="text" placeholder="Busque por serviço ou empresa" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-gray-300 rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm" />
      </div>
      <FilterPills />
      {searchTerm === '' && (<CategoryShowcase categories={categories} onSelectCategory={handleSelectCategory} />)}
      {searchTerm !== '' && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Resultados para "{searchTerm}"</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCompaniesBySearch.map(company => (
              <CompanyCard key={company.id} company={company} onClick={() => onSelectCompany(company)} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
          {filteredCompaniesBySearch.length === 0 && (
            <div className="text-center py-12"><p className="text-gray-500">Nenhuma empresa encontrada.</p><p className="text-gray-400 text-sm">Tente ajustar seus filtros ou busca.</p></div>
          )}
        </div>
      )}
      <BottomNavBar activeView={'explore'} onNavigate={nav} />
    </div>
  )
}
