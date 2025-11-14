import React from 'react';
import { SavedAddress } from '../types';
import { ChevronLeftIcon, MagnifyingGlassIcon, MapPinIcon as GpsIcon, HomeIcon, BriefcaseIcon, MapPinIcon, EllipsisVerticalIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface AddressSelectionPageProps {
    savedAddresses: SavedAddress[];
    currentAddress: string;
    onSelectAddress: (address: string) => void;
    onBack: () => void;
}

const AddressItem: React.FC<{ address: SavedAddress; isSelected: boolean; onSelect: () => void; }> = ({ address, isSelected, onSelect }) => {
    const Icon = address.type === 'Casa' ? HomeIcon : address.type === 'Trabalho' ? BriefcaseIcon : MapPinIcon;
    const addressString = `${address.street}, ${address.number}`;
    
    return (
        <div className={`flex items-start p-4 border rounded-lg ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
            <Icon className="h-6 w-6 text-gray-500 mt-1 mr-4 flex-shrink-0" />
            <div className="flex-1 cursor-pointer" onClick={onSelect}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{address.type === 'Outro' ? address.street : address.type}</h3>
                    {isSelected && <CheckCircleIcon className="h-6 w-6 text-red-500" />}
                </div>
                <p className="text-gray-700">{addressString}</p>
                <p className="text-sm text-gray-500">{`${address.neighborhood}, ${address.city}/${address.state}`}</p>
                {address.details && <p className="text-xs text-gray-400 mt-1">{address.details}</p>}
            </div>
             <button className="ml-2 p-2 text-gray-500">
                <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

const AddressSelectionPage: React.FC<AddressSelectionPageProps> = ({ savedAddresses, currentAddress, onSelectAddress, onBack }) => {

    const handleSelect = (address: SavedAddress) => {
        const newAddressString = `${address.street}, ${address.number}`;
        onSelectAddress(newAddressString);
        onBack();
    };
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute left-4 p-2">
                        <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-md font-bold text-gray-600 tracking-wider">ENDEREÇO DE ENTREGA</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 space-y-4">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Buscar endereço e número" className="w-full bg-white border border-gray-300 rounded-md py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>

                <button className="w-full flex items-center gap-4 p-4 text-left bg-white rounded-lg border border-gray-200">
                    <GpsIcon className="h-6 w-6 text-red-500" />
                    <div>
                        <p className="font-semibold text-red-500">Usar minha localização</p>
                        <p className="text-sm text-gray-500">R. Paraná - Centro - Cascavel</p>
                    </div>
                </button>
                
                <div className="space-y-3">
                    {savedAddresses.map(addr => (
                         <AddressItem 
                            key={addr.id}
                            address={addr}
                            isSelected={`${addr.street}, ${addr.number}` === currentAddress}
                            onSelect={() => handleSelect(addr)}
                         />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AddressSelectionPage;