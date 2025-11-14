import React from 'react';
import { HomeIcon, MagnifyingGlassIcon, ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon } from '@heroicons/react/24/solid';

type NavView = 'home' | 'explore' | 'messages' | 'profile';

interface BottomNavBarProps {
    activeView: NavView;
    onNavigate: (view: NavView) => void;
}

const NavItem: React.FC<{
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
        <Icon className="h-6 w-6" />
        <span className="text-xs mt-1">{label}</span>
    </button>
);


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onNavigate }) => {
    const navItems = [
        { id: 'home', label: 'Início', icon: HomeIcon },
        { id: 'explore', label: 'Explorar', icon: MagnifyingGlassIcon },
        { id: 'messages', label: 'Mensagens', icon: ChatBubbleOvalLeftEllipsisIcon },
        { id: 'profile', label: 'Perfil', icon: UserCircleIcon },
    ] as const;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeView === item.id}
                        onClick={() => onNavigate(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNavBar;
