import React, { useState } from 'react';
import { Company } from '../types';
import { ArrowLeftIcon, PencilIcon, PhotoIcon, WrenchScrewdriverIcon, StarIcon, ChartBarIcon, HeartIcon, ShareIcon, MapIcon, ClipboardDocumentListIcon, ChevronRightIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import StarRating from '../components/StarRating';

interface DashboardPageProps {
    company: Company;
    onBack: () => void;
}

type StatCategory = 'visits' | 'quotes' | 'reviews' | 'rating' | 'favorites' | 'shares' | 'origin' | 'services';
type DashboardTab = 'analysis' | 'portfolio' | 'services' | 'reviews';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; onClick: () => void; isActive: boolean; }> = ({ title, value, icon, onClick, isActive }) => (
    <button onClick={onClick} className={`bg-white p-4 rounded-lg shadow flex items-center gap-4 w-full text-left transition-all duration-200 ${isActive ? 'ring-2 ring-primary shadow-lg transform -translate-y-1' : 'hover:shadow-md hover:-translate-y-1'}`}>
        <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </button>
);

const DetailsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
        {children}
    </div>
);

const TabButton: React.FC<{
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
    </button>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ company, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStat, setSelectedStat] = useState<StatCategory>('visits');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<DashboardTab>('analysis');
    
    const formattedLocation = `${company.location.street}, ${company.location.number} - ${company.location.neighborhood}, ${company.location.city} - ${company.location.state}`;


    // Mock data for details
    const MOCK_DATA = {
        visits: [
            { day: 'Dom', count: 60 }, { day: 'Seg', count: 85 }, { day: 'Ter', count: 120 }, { day: 'Qua', count: 110 },
            { day: 'Qui', count: 150 }, { day: 'Sex', count: 180 }, { day: 'Sáb', count: 210 },
        ],
        origin: {
            cities: [
                { name: 'São Paulo', percentage: 45, neighborhoods: ['Pinheiros', 'Tatuapé', 'Moema'] },
                { name: 'Rio de Janeiro', percentage: 20, neighborhoods: ['Copacabana', 'Barra da Tijuca'] },
                { name: 'Belo Horizonte', percentage: 15, neighborhoods: ['Savassi', 'Lourdes'] },
            ],
        },
        services: [
            { name: 'Pintura Completa', quotes: 25 }, { name: 'Instalação de Porcelanato', quotes: 18 },
            { name: 'Outro Serviço', quotes: 14 },
        ],
        favorites: [
            { label: 'Esta Semana', count: 15 }, { label: 'Mês Passado', count: 62 },
        ],
        shares: [
            { platform: 'WhatsApp', count: 45 }, { platform: 'Instagram', count: 20 }, { platform: 'Facebook', count: 13 },
        ],
    };

    const tabs = [
        { id: 'analysis', label: 'Análise e Perfil', icon: PresentationChartBarIcon },
        { id: 'portfolio', label: 'Portfólio', icon: PhotoIcon },
        { id: 'services', label: 'Serviços', icon: WrenchScrewdriverIcon },
        { id: 'reviews', label: 'Avaliações', icon: StarIcon },
    ] as const;

    const renderDetails = () => {
        if (!selectedStat) return null;

        switch (selectedStat) {
            case 'visits':
                const maxVisits = Math.max(...MOCK_DATA.visits.map(v => v.count));
                return (
                    <DetailsCard title="Detalhes de Visitas ao Perfil (Últimos 7 dias)">
                        <div className="flex justify-between items-end h-40 space-x-2">
                            {MOCK_DATA.visits.map(visit => (
                                <div key={visit.day} className="flex-1 flex flex-col items-center justify-end">
                                    <div className="font-bold text-sm text-gray-700">{visit.count}</div>
                                    <div className="w-full bg-primary/20 rounded-t-md" style={{ height: `${(visit.count / maxVisits) * 100}%` }}></div>
                                    <div className="text-xs text-gray-500 mt-1">{visit.day}</div>
                                </div>
                            ))}
                        </div>
                    </DetailsCard>
                );
            
            case 'origin':
                const handleCityClick = (city: string) => {
                    setSelectedCity(prev => prev === city ? null : city);
                };
                const cityData = MOCK_DATA.origin.cities.find(c => c.name === selectedCity);

                return (
                    <DetailsCard title="Origem dos Acessos">
                        <ul className="space-y-2">
                            {MOCK_DATA.origin.cities.map(city => (
                                <li key={city.name}>
                                    <button onClick={() => handleCityClick(city.name)} className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span>{city.name}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold">{city.percentage}%</span>
                                                <ChevronRightIcon className={`h-5 w-5 text-gray-400 transition-transform ${selectedCity === city.name ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>
                                    </button>
                                     {selectedCity === city.name && cityData && (
                                        <div className="pl-6 pt-2 pb-1 border-l-2 border-primary ml-3">
                                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Bairros mais populares:</h4>
                                            <ul className="space-y-1 list-disc list-inside text-sm text-gray-500">
                                                {cityData.neighborhoods.map(n => <li key={n}>{n}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </DetailsCard>
                );

            case 'services':
                 return (
                    <DetailsCard title="Serviços Mais Populares">
                        <ul className="space-y-2">
                            {MOCK_DATA.services.map(service => (
                                <li key={service.name} className="flex justify-between p-2 rounded-md bg-gray-50">
                                    <span>{service.name}</span>
                                    <span className="font-bold">{service.quotes} orçamentos</span>
                                </li>
                            ))}
                        </ul>
                    </DetailsCard>
                );
            case 'favorites':
                 return (
                    <DetailsCard title="Evolução de Favoritos">
                        <div className="flex gap-4">
                            {MOCK_DATA.favorites.map(fav => (
                                <div key={fav.label} className="flex-1 bg-gray-50 p-3 text-center rounded-md">
                                    <div className="text-2xl font-bold">{fav.count}</div>
                                    <div className="text-sm text-gray-500">{fav.label}</div>
                                </div>
                            ))}
                        </div>
                    </DetailsCard>
                );
            case 'shares':
                return (
                    <DetailsCard title="Plataformas de Compartilhamento">
                       <ul className="space-y-2">
                            {MOCK_DATA.shares.map(share => (
                                <li key={share.platform} className="flex justify-between p-2 rounded-md bg-gray-50">
                                    <span>{share.platform}</span>
                                    <span className="font-bold">{share.count} vezes</span>
                                </li>
                            ))}
                        </ul>
                    </DetailsCard>
                );
            default:
                return (
                    <DetailsCard title="Dados não disponíveis">
                        <p>A análise para esta métrica estará disponível em breve.</p>
                    </DetailsCard>
                );
        }
    };


    return (
        <div className="bg-gray-50 min-h-screen">
             <header className="bg-white shadow-sm sticky top-0 z-20">
                 <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                            <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-primary">Meu Painel</h1>
                     </div>
                     <button onClick={() => alert('Visualizar perfil público')} className="font-semibold text-primary hover:underline">
                         Ver Perfil
                     </button>
                 </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                 <div className="mb-8 bg-white p-2 rounded-lg shadow-sm flex flex-wrap gap-2">
                    {tabs.map(tab => (
                        <TabButton
                            key={tab.id}
                            label={tab.label}
                            icon={tab.icon}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>

                <div>
                    {activeTab === 'analysis' && (
                        <div className="space-y-8">
                            <section className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Dados da Empresa</h2>
                                    <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-sm font-semibold text-primary py-1 px-3 rounded-md border border-primary/50 hover:bg-primary/10">
                                        <PencilIcon className="h-4 w-4" />
                                        {isEditing ? 'Salvar' : 'Editar'}
                                    </button>
                                </div>
                                <div className="space-y-4 text-secondary-foreground">
                                    <div><span className="font-semibold w-32 inline-block">Nome:</span> {company.name}</div>
                                    <div><span className="font-semibold w-32 inline-block">Categoria:</span> {company.category}</div>
                                    <div><span className="font-semibold w-32 inline-block">Endereço:</span> {formattedLocation}</div>
                                    <div>
                                        <span className="font-semibold w-32 inline-block align-top">Descrição:</span> 
                                        <p className="inline-block max-w-2xl">{company.description}</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4">Dashboard Analítico</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard title="Visitas ao Perfil (30d)" value="1,284" icon={<ChartBarIcon className="h-6 w-6 text-primary" />} onClick={() => { setSelectedStat('visits'); setSelectedCity(null); }} isActive={selectedStat === 'visits'} />
                                    <StatCard title="Orçamentos Recebidos" value="57" icon={<WrenchScrewdriverIcon className="h-6 w-6 text-primary" />} onClick={() => { setSelectedStat('quotes'); setSelectedCity(null); }} isActive={selectedStat === 'quotes'}/>
                                    <StatCard title="Avaliações Novas" value="8" icon={<StarIcon className="h-6 w-6 text-primary" />} onClick={() => { setSelectedStat('reviews'); setSelectedCity(null); }} isActive={selectedStat === 'reviews'}/>
                                    <StatCard title="Nota Média" value={company.rating.toFixed(1)} icon={<StarRating rating={company.rating}/>} onClick={() => { setSelectedStat('rating'); setSelectedCity(null); }} isActive={selectedStat === 'rating'}/>
                                    <StatCard title="Favoritos" value={company.favoritesCount?.toString() || '0'} icon={<HeartIcon className="h-6 w-6 text-primary" />} onClick={() => { setSelectedStat('favorites'); setSelectedCity(null); }} isActive={selectedStat === 'favorites'}/>
                                    <StatCard title="Compartilhamentos" value={company.sharesCount?.toString() || '0'} icon={<ShareIcon className="h-6 w-6 text-primary" />} onClick={() => { setSelectedStat('shares'); setSelectedCity(null); }} isActive={selectedStat === 'shares'}/>
                                    <StatCard title="Principal Origem" value="São Paulo (45%)" icon={<MapIcon className="h-6 w-6 text-primary" />} onClick={() => { setSelectedStat('origin'); setSelectedCity(null); }} isActive={selectedStat === 'origin'}/>
                                    <StatCard title="Serviço Popular" value="Pintura" icon={<ClipboardDocumentListIcon className="h-6 w-6 text-primary" />} onClick={() => { setSelectedStat('services'); setSelectedCity(null); }} isActive={selectedStat === 'services'}/>
                                </div>
                            </section>
                            
                            <section>
                                {renderDetails()}
                            </section>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <section className="bg-white p-6 rounded-lg shadow">
                             <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Gerenciar Portfólio</h2>
                                <button className="flex items-center gap-2 text-sm font-semibold text-primary py-1 px-3 rounded-md border border-primary/50 hover:bg-primary/10">
                                    <PhotoIcon className="h-4 w-4" />
                                    Adicionar Foto
                                </button>
                             </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {company.portfolio.map((imgUrl, index) => (
                                    <div key={index} className="relative group">
                                        <img src={imgUrl} alt={`Portfolio item ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                                            <button className="text-white text-xs bg-red-600 px-2 py-1 rounded">Remover</button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </section>
                    )}

                    {activeTab === 'services' && (
                        <section className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Gerenciar Serviços</h2>
                                <button className="flex items-center gap-2 text-sm font-semibold text-primary py-1 px-3 rounded-md border border-primary/50 hover:bg-primary/10">
                                    <WrenchScrewdriverIcon className="h-4 w-4" />
                                    Adicionar Serviço
                                </button>
                            </div>
                            <div className="space-y-2">
                                {company.services.map(service => (
                                    <div key={service.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                                        <div>
                                            <p className="font-semibold">{service.name}</p>
                                            <p className="text-sm text-gray-500">{service.price}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-sm text-blue-600 hover:underline">Editar</button>
                                            <button className="text-sm text-red-600 hover:underline">Excluir</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'reviews' && (
                        <section className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Análise de Comentários</h2>
                            <div className="space-y-4">
                               {company.reviews.map(review => (
                                    <div key={review.id} className="p-3 border rounded-md">
                                       <div className="flex justify-between items-center">
                                           <p className="font-semibold">{review.author}</p>
                                           <StarRating rating={review.rating} />
                                       </div>
                                       <p className="text-gray-600 mt-1 italic">"{review.comment}"</p>
                                    </div>
                               ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;