import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <style>
                {`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }
                .animate-pulse-custom {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                `}
            </style>
            <div className="text-center animate-pulse-custom">
                <div className="bg-primary-foreground text-primary rounded-lg w-24 h-24 flex items-center justify-center mx-auto shadow-2xl">
                    <span className="font-bold text-6xl">C</span>
                </div>
                <h1 className="text-5xl font-bold text-primary-foreground mt-4">Contrato</h1>
                <p className="text-primary-foreground/80 mt-2">Conectando serviços e pessoas.</p>
            </div>
        </div>
    );
};

export default SplashScreen;
