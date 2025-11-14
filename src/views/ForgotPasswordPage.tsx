import React from 'react';
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'

interface ForgotPasswordPageProps {
    onNavigate?: (view: 'login') => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget)
        const email = String(form.get('email') || '')
        try {
            const supabase = getSupabase();
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) return
            (onNavigate ? onNavigate('login') : navigate('/login'))
        } catch {}
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary text-primary-foreground rounded-md w-10 h-10 flex items-center justify-center">
                    <span className="font-bold text-2xl">C</span>
                </div>
                <h1 className="text-3xl font-bold text-primary">Contrato</h1>
            </div>
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Recuperar Senha
                </h2>
                <p className="text-center text-gray-600 mb-6">Digite seu e-mail para receber o link de recuperação.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input name="email" type="email" id="email" required placeholder="seu@email.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Enviar Link
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Lembrou a senha?{' '}
                        <a onClick={() => onNavigate ? onNavigate('login') : navigate('/login')} className="font-semibold text-primary hover:underline cursor-pointer">
                            Voltar para o login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
