import React from 'react';
import { useNavigate } from 'react-router-dom'
import BottomNavBar from '../components/BottomNavBar'
import { getSupabase } from '../lib/supabase'
import { ChevronRightIcon, UserCircleIcon, DocumentTextIcon, Cog6ToothIcon, BuildingStorefrontIcon, ArrowRightOnRectangleIcon, ChartBarIcon, HeartIcon, MapPinIcon, QuestionMarkCircleIcon, CreditCardIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

type View = 'dashboard' | 'messages' | 'clientQuotes' | 'clientSettings' | 'login' | 'favorites' | 'subscription' | 'companyQuotes' | 'help' | 'editCompanyProfile';

interface ProfilePageProps {
    authStatus?: 'authenticated_client' | 'authenticated_company';
    onNavigate?: (view: View) => void;
    onLogout?: () => void;
    userName?: string;
    onViewProfile?: () => void;
}

const ListItem: React.FC<{
    icon: React.ElementType,
    label: string,
    onClick: () => void,
    isDestructive?: boolean,
    badge?: number,
}> = ({ icon: Icon, label, onClick, isDestructive, badge }) => (
    <button onClick={onClick} className={`w-full flex items-center p-4 bg-white hover:bg-gray-50 transition-colors text-left ${isDestructive ? 'text-red-600' : 'text-gray-800'}`}>
        <Icon className={`h-6 w-6 mr-4 ${isDestructive ? 'text-red-500' : 'text-gray-500'}`} />
        <span className="flex-grow font-medium">{label}</span>
        {badge && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mr-2">{badge}</span>
        )}
        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
    </button>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ authStatus = 'authenticated_client', onNavigate, onLogout, userName, onViewProfile }) => {
    const navigate = useNavigate()

    const renderClientView = () => (
        <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ListItem icon={DocumentTextIcon} label="Meus Orçamentos" onClick={() => (onNavigate ? onNavigate('clientQuotes') : navigate('/client-quotes'))} badge={2} />
                <div className="h-px bg-gray-200/80 w-full ml-14"></div>
                <ListItem icon={HeartIcon} label="Favoritos" onClick={() => (onNavigate ? onNavigate('favorites') : navigate('/favorites'))} />
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
                 <ListItem icon={MapPinIcon} label="Endereços" onClick={() => alert('Em breve!')} />
                 <div className="h-px bg-gray-200/80 w-full ml-14"></div>
                 <ListItem icon={Cog6ToothIcon} label="Configurações" onClick={() => (onNavigate ? onNavigate('clientSettings') : navigate('/settings'))} />
                 <div className="h-px bg-gray-200/80 w-full ml-14"></div>
                 <ListItem icon={QuestionMarkCircleIcon} label="Ajuda" onClick={() => alert('Em breve!')} />
            </div>
            <div className="mt-6">
                <ListItem icon={ArrowRightOnRectangleIcon} label="Sair" onClick={async () => { try { const supabase = getSupabase(); await supabase.auth.signOut(); navigate('/login'); } catch {} }} isDestructive />
            </div>
        </>
    );

    const renderCompanyView = () => (
         <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ListItem icon={ChartBarIcon} label="Meu Painel (Dashboard)" onClick={() => (onNavigate ? onNavigate('dashboard') : navigate('/dashboard'))} />
                <div className="h-px bg-gray-200/80 w-full ml-14"></div>
                <ListItem icon={DocumentTextIcon} label="Orçamentos" onClick={() => (onNavigate ? onNavigate('companyQuotes') : navigate('/company-quotes'))} badge={2} />
                <div className="h-px bg-gray-200/80 w-full ml-14"></div>
                <ListItem icon={PencilSquareIcon} label="Editar Perfil" onClick={() => (onNavigate ? onNavigate('editCompanyProfile') : navigate('/company/edit'))} />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
                 <ListItem icon={CreditCardIcon} label="Planos e Assinatura" onClick={() => (onNavigate ? onNavigate('subscription') : navigate('/subscription'))} />
                 <div className="h-px bg-gray-200/80 w-full ml-14"></div>
                 <ListItem icon={QuestionMarkCircleIcon} label="Ajuda e Suporte" onClick={() => (onNavigate ? onNavigate('help') : navigate('/help'))} />
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
                <ListItem icon={ArrowRightOnRectangleIcon} label="Sair" onClick={async () => { try { const supabase = getSupabase(); await supabase.auth.signOut(); navigate('/login'); } catch {} }} isDestructive />
            </div>
        </>
    );

    return (
        <div className="container mx-auto p-4 pb-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                   {authStatus === 'authenticated_company' 
                    ? <BuildingStorefrontIcon className="h-9 w-9"/>
                    : <UserCircleIcon className="h-9 w-9"/>
                   }
                </div>
                <div>
                    <h1 className="text-xl font-bold">{userName || 'Usuário'}</h1>
                     <button onClick={onViewProfile} className="text-sm font-semibold text-primary hover:underline">
                        Ver meu perfil
                    </button>
                </div>
            </div>
            
            <div className="space-y-0">
                {authStatus === 'authenticated_client' && renderClientView()}
                {authStatus === 'authenticated_company' && renderCompanyView()}
            </div>
            <BottomNavBar activeView={'profile'} onNavigate={(v) => {
                if (v === 'home') navigate('/home')
                if (v === 'explore') navigate('/explore')
                if (v === 'messages') navigate('/messages')
                if (v === 'profile') navigate('/profile')
            }} />
        </div>
    );
};

export default ProfilePage;
