import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'

interface LoginPageProps {
    onNavigate?: (view: 'register' | 'forgotPassword') => void;
    onLogin?: (userType: 'client' | 'company') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
    const [userType, setUserType] = useState<'client' | 'company'>('client');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget)
        const email = String(form.get('email') || '')
        const password = String(form.get('password') || '')
        setError(null)
        setLoading(true)
        try {
            const supabase = getSupabase()
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                const msg = error.message || 'Não foi possível entrar'
                if (/invalid login credentials/i.test(msg)) setError('E-mail ou senha inválidos')
                else if (/email.+not.+confirmed/i.test(msg)) setError('Confirme seu e-mail antes de entrar')
                else setError(msg)
            } else {
                navigate('/home')
            }
        } catch {
            setError('Erro de rede. Tente novamente')
        } finally {
            setLoading(false)
        }
    };

    const TabButton: React.FC<{ type: 'client' | 'company'; label: string }> = ({ type, label }) => (
        <button
            onClick={() => setUserType(type)}
            className={`w-1/2 py-3 text-center font-semibold border-b-4 transition-colors ${
                userType === type ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary text-primary-foreground rounded-md w-10 h-10 flex items-center justify-center">
                    <span className="font-bold text-2xl">C</span>
                </div>
                <h1 className="text-3xl font-bold text-primary">Contrato</h1>
            </div>
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="flex">
                    <TabButton type="client" label="Sou Cliente" />
                    <TabButton type="company" label="Sou Empresa" />
                </div>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Bem-vindo(a) de volta!
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                            <input name="email" type="email" id="email" required placeholder="seu@email.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                                <a onClick={() => onNavigate ? onNavigate('forgotPassword') : navigate('/forgot')} className="text-sm text-primary hover:underline cursor-pointer">Esqueceu a senha?</a>
                            </div>
                            <input name="password" type="password" id="password" required placeholder="********" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                        {error && (
                          <p className="mt-3 text-sm text-red-600">{error}</p>
                        )}
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <a onClick={() => onNavigate ? onNavigate('register') : navigate('/register')} className="font-semibold text-primary hover:underline cursor-pointer">
                                Cadastre-se
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
