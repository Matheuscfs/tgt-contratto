import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'
import { Company, Service, Review } from '../types/domain';
import StarRating from '../components/StarRating';
import QuoteModal from '../components/QuoteModal';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { ArrowLeftIcon, MapPinIcon, ShareIcon, HeartIcon as HeartOutlineIcon, ChatBubbleOvalLeftEllipsisIcon, CheckBadgeIcon, PencilSquareIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface CompanyPageProps {
    company: Company;
    onBack: () => void;
    isOwner: boolean;
    onEdit: () => void;
    onToggleFavorite: (companyId: string) => void;
    onStartChat: (companyId: string) => void;
}

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
    <div className="p-4 border-b">
        <div className="flex items-center justify-between">
            <p className="font-semibold">{review.author}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
        </div>
        <div className="my-2">
            <StarRating rating={review.rating} />
        </div>
        <p className="text-gray-700">{review.comment}</p>
    </div>
);

const CompanyPage: React.FC<CompanyPageProps> = ({ company, onBack, isOwner, onEdit, onToggleFavorite, onStartChat }) => {
    const [isQuoteModalOpen, setQuoteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
    const navigate = useNavigate()

    const openQuoteModal = (service: Service | null) => {
        setSelectedService(service);
        setQuoteModalOpen(true);
    };
    
    const handleToggleService = (serviceId: string) => {
        setExpandedServiceId(prevId => prevId === serviceId ? null : serviceId);
    };

    const formattedLocation = `${company.location.city}, ${company.location.state}`;

    return (
        <div className="bg-gray-100 min-h-screen">
             <QuoteModal 
                isOpen={isQuoteModalOpen} 
                onClose={() => setQuoteModalOpen(false)} 
                companyName={company.name}
                serviceName={selectedService?.name}
            />
            <div className="relative h-48 md:h-64">
                <img src={company.coverUrl} alt={`${company.name} cover`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                <button onClick={onBack} className="absolute top-4 left-4 bg-white/80 rounded-full p-2.5 hover:bg-white transition-all">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                </button>
                <div className="absolute top-4 right-4 flex gap-2">
                     <button className="bg-white/80 rounded-full p-2.5 hover:bg-white transition-all"><ShareIcon className="h-6 w-6 text-gray-800" /></button>
                     <button onClick={async () => {
                        try {
                          const supabase = getSupabase()
                          const { data: user } = await supabase.auth.getUser()
                          const uid = user.user?.id
                          if (!uid) return
                          if (company.isFavorite) {
                            await supabase.from('user_favorites').delete().eq('user_id', uid).eq('company_id', company.id)
                          } else {
                            await supabase.from('user_favorites').insert({ user_id: uid, company_id: company.id })
                          }
                        } catch {}
                     }} className="bg-white/80 rounded-full p-2.5 hover:bg-white transition-all">
                        {company.isFavorite ? <HeartSolidIcon className="h-6 w-6 text-red-500" /> : <HeartOutlineIcon className="h-6 w-6 text-gray-800" />}
                     </button>
                </div>
            </div>
            
            <div className="container mx-auto px-4 -mt-16 relative z-10 pb-8">
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <img src={company.logoUrl} alt={`${company.name} logo`} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md"/>
                        <div className="flex-1 mt-2 md:mt-0">
                            <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
                            <p className="text-gray-600 mt-1">{company.category}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                               <div className="flex items-center gap-1">
                                 <StarRating rating={company.rating} />
                                 <span className="font-bold text-gray-800 ml-1">{company.rating.toFixed(1)}</span>
                                 <span>({company.reviewCount} avaliações)</span>
                               </div>
                               <span className="hidden md:inline">|</span>
                               <div className="flex items-center gap-1">
                                 <MapPinIcon className="h-4 w-4"/>
                                 <span>{formattedLocation}</span>
                               </div>
                            </div>
                        </div>
                         <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                             <button onClick={() => openQuoteModal(null)} className="flex-1 w-full text-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                                Solicitar Orçamento
                            </button>
                             <button onClick={async () => {
                                try {
                                    const supabase = getSupabase()
                                    const { data: user } = await supabase.auth.getUser()
                                    const uid = user.user?.id
                                    if (!uid) return
                                    const { data: conv } = await supabase
                                      .from('conversations')
                                      .insert({ client_id: uid, company_id: company.id })
                                      .select()
                                      .single()
                                    if (conv?.id) navigate(`/chat/${conv.id}`)
                                } catch {}
                             }} className="flex-1 w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-secondary-hover transition-colors">
                                <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5"/>
                                Mensagem
                             </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-8">
                     {/* ABOUT SECTION */}
                     <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Sobre a Empresa</h2>
                        <p className="text-gray-700 leading-relaxed">{company.description}</p>
                         <div className="mt-4">
                            <h3 className="font-semibold mb-2">Especialidades:</h3>
                            <div className="flex flex-wrap gap-2">
                                {company.specialties.map(spec => (
                                    <span key={spec} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                        <CheckBadgeIcon className="h-4 w-4" />
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                                Endereço
                            </h3>
                            <p className="text-sm text-gray-700 ml-7">
                                {company.location.street}, {company.location.number}{company.location.complement ? `, ${company.location.complement}` : ''}<br/>
                                {company.location.neighborhood}, {company.location.city} - {company.location.state}
                            </p>
                            <div className="mt-4 ml-7 flex flex-wrap gap-3">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.location.street}, ${company.location.number}, ${company.location.city}, ${company.location.state}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary py-2 px-4 rounded-lg border border-primary/50 hover:bg-primary/10 transition-colors"
                                >
                                    <MapPinIcon className="h-4 w-4" />
                                    Como chegar
                                </a>
                                {company.phone && (
                                     <a
                                        href={`https://wa.me/${company.phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 py-2 px-4 rounded-lg border border-green-500/50 hover:bg-green-500/10 transition-colors"
                                    >
                                        <WhatsAppIcon className="h-4 w-4"/>
                                        WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                     </div>
                      {/* SERVICES SECTION */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                         <h2 className="text-xl font-bold mb-4">Serviços Oferecidos</h2>
                         <div className="space-y-4">
                            {company.services.map(service => {
                                const isExpanded = expandedServiceId === service.id;
                                const hasDetails = service.imageUrl || service.detailedDescription;
                                return (
                                    <div key={service.id} className="bg-gray-50 p-4 rounded-lg border">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                            <button onClick={() => hasDetails && handleToggleService(service.id)} className={`flex-1 text-left ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-lg text-gray-800">{service.name}</h4>
                                                    {hasDetails && (
                                                        <span className="text-primary p-1 rounded-full">
                                                            {isExpanded ? <MinusIcon className="h-5 w-5"/> : <PlusIcon className="h-5 w-5"/>}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                                <p className="font-semibold text-primary text-md">{service.price}</p>
                                            </button>
                                            <div className="w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0 self-start">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openQuoteModal(service);
                                                    }}
                                                    className="w-full bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors text-sm"
                                                >
                                                    Orçamento
                                                </button>
                                            </div>
                                        </div>
                                         <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen mt-4' : 'max-h-0'}`}>
                                           <div className="space-y-4">
                                               {service.imageUrl && (
                                                   <img src={service.imageUrl} alt={`Imagem para ${service.name}`} className="w-full h-48 object-cover rounded-lg shadow-sm" />
                                               )}
                                               {service.detailedDescription && (
                                                   <p className="text-gray-600 text-sm leading-relaxed">{service.detailedDescription}</p>
                                               )}
                                           </div>
                                        </div>
                                    </div>
                                );
                            })}
                         </div>
                      </div>
                      {/* PORTFOLIO SECTION */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                         <h2 className="text-xl font-bold mb-4">Portfólio</h2>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {company.portfolio.map((imgUrl, index) => (
                                <img key={index} src={imgUrl} alt={`Portfolio item ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow-sm" />
                            ))}
                         </div>
                      </div>
                   </div>
                   
                   <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md sticky top-24">
                            <h2 className="text-xl font-bold p-4 border-b">Avaliações de Clientes</h2>
                            <div className="max-h-[600px] overflow-y-auto">
                                {company.reviews.length > 0 ? (
                                    company.reviews.map(review => <ReviewItem key={review.id} review={review} />)
                                ) : (
                                    <p className="p-4 text-gray-500">Nenhuma avaliação ainda.</p>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50">
                                <button className="w-full text-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                                    Avaliar Serviço
                                </button>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyPage;
