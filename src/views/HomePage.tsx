import React from 'react';
import { Company, Category } from '../types/domain';
import CompanyCard from '../components/CompanyCard';
import FeaturedCompanies from '../components/FeaturedCompanies';
import AdBanner from '../components/AdBanner';
import HomeHeader from '../components/HomeHeader';
import CategoryGrid from '../components/CategoryGrid';
import TrendingServices from '../components/TrendingServices';
import { CATEGORIES } from '../constants';
import { getCategories } from '../features/categories/api'
import BottomNavBar from '../components/BottomNavBar'
import { useNavigate } from 'react-router-dom'

interface HomePageProps {
    companies?: Company[];
    onSelectCompany?: (company: Company) => void;
    onToggleFavorite?: (companyId: string) => void;
    userAddress?: string;
    onNavigate?: (view: 'notifications' | 'addressSelection') => void;
    onSelectCategory?: (category: Category) => void;
    onExploreAll?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ companies = [], onSelectCompany = () => {}, onToggleFavorite = () => {}, userAddress = 'Seu endereço', onNavigate = () => {}, onSelectCategory = () => {}, onExploreAll = () => {} }) => {
    const featuredCompanies = companies.filter(c => c.isFeatured);
    const navigate = useNavigate()
    const [dbCategories, setDbCategories] = React.useState<Category[] | null>(null)
    React.useEffect(() => {
        if (import.meta.env.VITE_SUPABASE_ENABLED === 'true') {
            getCategories().then(setDbCategories).catch(() => setDbCategories(null))
        }
    }, [])
    
    return (
        <div className="bg-white">
            <HomeHeader address={userAddress} onAddressClick={() => onNavigate('addressSelection')} onNotificationsClick={() => onNavigate('notifications')} />
            <div className="container mx-auto px-4 pb-24 md:pb-8">
                <AdBanner 
                    title="Sua reforma dos sonhos começa aqui!"
                    description="Os melhores profissionais para tirar seu projeto do papel."
                    imageUrl="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    companyName="Alfa Reformas"
                    onClick={() => {
                        const company = companies.find(c => c.id === '1');
                        if (company) onSelectCompany(company);
                    }}
                />

                <section className="mt-8">
                    <h2 className="text-2xl font-bold mb-2">Navegue por Categorias</h2>
                    <CategoryGrid categories={dbCategories ?? CATEGORIES} onSelectCategory={onSelectCategory} onSelectAll={onExploreAll} />
                </section>
                
                <TrendingServices />

                <FeaturedCompanies companies={featuredCompanies} onSelectCompany={onSelectCompany} onToggleFavorite={onToggleFavorite} />
                
                <section className="mt-8">
                     <h2 className="text-xl font-bold mb-4">
                        Mais Empresas
                     </h2>
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
                </section>
            </div>
            <BottomNavBar activeView={'home'} onNavigate={(v) => {
                if (v === 'home') navigate('/home')
                if (v === 'explore') navigate('/explore')
                if (v === 'messages') navigate('/messages')
                if (v === 'profile') navigate('/profile')
            }} />
        </div>
    );
};

export default HomePage;
