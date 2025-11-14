import React from 'react';
import { ChevronDownIcon, BellIcon } from '@heroicons/react/24/solid';

interface HomeHeaderProps {
    address: string;
    onAddressClick: () => void;
    onNotificationsClick: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ address, onAddressClick, onNotificationsClick }) => {
    return (
        <header className="bg-white sticky top-0 z-30 pt-4 pb-2 md:hidden">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div>
                    <button onClick={onAddressClick} className="flex items-center gap-1">
                        <span className="font-bold text-lg text-gray-800">{address}</span>
                        <ChevronDownIcon className="h-4 w-4 text-primary font-bold" />
                    </button>
                </div>
                <div className="relative">
                    <button onClick={onNotificationsClick} className="p-2">
                        <BellIcon className="h-6 w-6 text-gray-600" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HomeHeader;