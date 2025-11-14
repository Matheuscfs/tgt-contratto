import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

type NavView = 'home' | 'explore' | 'messages' | 'profile';
type View = 'splash' | 'home' | 'company' | 'register' | 'login' | 'forgotPassword' | 'dashboard' | 'explore' | 'messages' | 'profile' | 'clientQuotes' | 'clientSettings' | 'favorites' | 'myClientProfile' | 'notifications' | 'chat';
type AuthStatus = 'unauthenticated' | 'authenticated_client' | 'authenticated_company';

interface DesktopHeaderProps {
    activeView: NavView;
    onNavigate: (view: View) => void;
    authStatus: AuthStatus;
    userName?: string;
    onLogout: () => void;
}

const NavLink: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick} 
        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        {label}
    </button>
);

const ProfileDropdown: React.FC<{userName?: string, onNavigate: (view: 'profile' | 'notifications') => void, onLogout: () => void}> = ({ userName, onNavigate, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <UserCircleIcon className="h-7 w-7 text-gray-500" />
                <span className="text-sm font-semibold hidden lg:block">{userName || 'Perfil'}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500 hidden lg:block" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <button onClick={() => { onNavigate('profile'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</button>
                    <button onClick={() => { onNavigate('notifications'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notificações</button>
                    <div className="my-1 h-px bg-gray-100"></div>
                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sair</button>
                </div>
            )}
        </div>
    );
};

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ activeView, onNavigate, authStatus, userName, onLogout }) => {
    const navItems = [
        { id: 'home', label: 'Início' },
        { id: 'explore', label: 'Explorar' },
        { id: 'messages', label: 'Mensagens' },
    ] as const;

    return (
        <header className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
            <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
                     <div className="bg-primary text-primary-foreground rounded-md w-9 h-9 flex items-center justify-center">
                        <span className="font-bold text-xl">C</span>
                     </div>
                     <span className="font-bold text-2xl text-primary">Contrato</span>
                </div>
                <nav className="flex items-center gap-2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.id}
                            label={item.label}
                            isActive={activeView === item.id}
                            onClick={() => onNavigate(item.id)}
                        />
                    ))}
                </nav>
                <div>
                   <ProfileDropdown userName={userName} onNavigate={onNavigate as (view: 'profile' | 'notifications') => void} onLogout={onLogout} />
                </div>
            </div>
        </header>
    );
};

export default DesktopHeader;
