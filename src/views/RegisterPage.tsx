import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'

interface RegisterPageProps {
    onNavigate?: (view: 'login') => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
    const [userType, setUserType] = useState<'client' | 'company'>('client');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget)
        const email = String(form.get('email') || '')
        const password = String(form.get('password') || '')
        const name = String(form.get('name') || form.get('company_name') || '')
        setError(null)
        setLoading(true)
        try {
            const supabase = getSupabase()
            const { data: signUpData, error: signErr } = await supabase.auth.signUp({ email, password })
            if (signErr) { setError(signErr.message); return }
            const uid = signUpData.user?.id
            if (uid) {
                await supabase.from('profiles').upsert({ user_id: uid, role: userType, name })
                if (userType === 'company') {
                    const companyName = String(form.get('company_name') || '')
                    const cnpj = String(form.get('cnpj') || '')
                    const slug = companyName.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    await supabase.from('companies').insert({ owner_user_id: uid, company_name: companyName, legal_name: companyName, cnpj, slug })
                }
            }
            (onNavigate ? onNavigate('login') : navigate('/login'))
        } catch (err: any) { setError(err?.message || 'Erro ao cadastrar') } finally { setLoading(false) }
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

    const ClientForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Nome Completo</label>
                <input name="name" type="text" required className="mt-1 block w-full input" />
            </div>
            <div>
                <label className="block text-sm font-medium">E-mail</label>
                <input name="email" type="email" required className="mt-1 block w-full input" />
            </div>
            <div>
                <label className="block text-sm font-medium">Senha</label>
                <input name="password" type="password" required className="mt-1 block w-full input" />
            </div>
             <div>
                <label className="block text-sm font-medium">Confirmar Senha</label>
                <input name="password_confirm" type="password" required className="mt-1 block w-full input" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Enviando...' : 'Criar Conta de Cliente'}</button>
        </form>
    );

    const CompanyForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <style>{`.input { all: unset; box-sizing: border-box; width: 100%; display: block; margin-top: 4px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); } .input:focus { outline: 2px solid #0052cc; border-color: #0052cc; } .btn-primary { all: unset; box-sizing: border-box; width: 100%; cursor: pointer; padding: 12px 16px; border-radius: 6px; background-color: #0052cc; color: white; font-weight: 500; text-align: center; } .btn-primary:hover { background-color: #0041a3; }`}</style>
             <div>
                <label className="block text-sm font-medium">Nome da Empresa</label>
                <input name="company_name" type="text" required className="mt-1 block w-full input" />
            </div>
             <div>
                <label className="block text-sm font-medium">CNPJ</label>
                <input name="cnpj" type="text" required className="mt-1 block w-full input" />
            </div>
             <div>
                <label className="block text-sm font-medium">E-mail de Contato</label>
                <input name="email" type="email" required className="mt-1 block w-full input" />
            </div>
             <div>
                <label className="block text-sm font-medium">Senha</label>
                <input name="password" type="password" required className="mt-1 block w-full input" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Enviando...' : 'Cadastrar Empresa'}</button>
        </form>
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
                       {userType === 'client' ? 'Crie sua conta' : 'Cadastre seu negócio'}
                    </h2>
                    {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
                    {userType === 'client' ? <ClientForm /> : <CompanyForm />}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Já possui uma conta?{' '}
                            <a onClick={() => onNavigate ? onNavigate('login') : navigate('/login')} className="font-semibold text-primary hover:underline cursor-pointer">
                                Faça login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
