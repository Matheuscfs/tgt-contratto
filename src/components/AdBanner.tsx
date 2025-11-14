import React from 'react';

interface AdBannerProps {
    title: string;
    description: string;
    imageUrl: string;
    companyName: string;
    onClick: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ title, description, imageUrl, companyName, onClick }) => {
    return (
        <section className="my-8 rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={onClick}>
            <div className="relative">
                <img src={imageUrl} alt={title} className="w-full h-48 object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 p-8 flex flex-col justify-center">
                    <span className="text-sm font-semibold text-white bg-primary/80 px-2 py-1 rounded self-start mb-2">Patrocinado por {companyName}</span>
                    <h2 className="text-3xl font-bold text-white">{title}</h2>
                    <p className="text-lg text-gray-200 mt-2 max-w-lg">{description}</p>
                </div>
            </div>
        </section>
    );
};

export default AdBanner;
