import React, { useState } from 'react';
import { Subscription } from '../types/domain';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, CreditCardIcon, CalendarDaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { getSupabase } from '../lib/supabase'

interface SubscriptionPageProps {
    subscription?: Subscription;
    onBack?: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ subscription, onBack }) => {
    const fallback: Subscription = subscription ?? {
        planName: 'Plano Básico',
        status: 'Pendente',
        price: 49.9,
        renewalDate: '—',
        paymentMethod: { brand: 'PIX', last4: '0000' },
        billingHistory: []
    }
    const [qr, setQr] = useState<string | null>(null)
    const [creating, setCreating] = useState(false)

    const createPixCharge = async () => {
        try {
            setCreating(true)
            const res = await fetch(`/api/abacatepay-create-pix`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Math.round(fallback.price * 100), description: fallback.planName })
            })
            const data = await res.json()
            setQr(data.qrcode || null)
            const supabase = getSupabase()
            const { data: user } = await supabase.auth.getUser()
            const uid = user.user?.id
            if (uid) {
                await supabase.from('subscriptions').upsert({ company_id: uid, plan_name: fallback.planName, status: 'Pendente', price: fallback.price })
            }
        } catch {} finally { setCreating(false) }
    }
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-primary">Planos e Assinatura</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Seu Plano Atual</h2>
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-2xl font-extrabold text-primary">{fallback.planName}</p>
                                <div className="flex items-center gap-2 mt-1 text-green-600">
                                    <CheckCircleIcon className="h-5 w-5" />
                                    <span className="font-semibold text-md">{fallback.status}</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                                R$ {fallback.price.toFixed(2).replace('.', ',')}
                                <span className="text-sm font-normal text-gray-500">/mês</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                            <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                            <div>
                                <p className="text-gray-500">Próxima cobrança</p>
                                <p className="font-semibold text-gray-700">{fallback.renewalDate}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <CreditCardIcon className="h-6 w-6 text-gray-400" />
                            <div>
                                <p className="text-gray-500">Forma de pagamento</p>
                                <p className="font-semibold text-gray-700">{fallback.paymentMethod.brand} final •••• {fallback.paymentMethod.last4}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row gap-3">
                        <button onClick={createPixCharge} disabled={creating} className="w-full flex-1 text-center bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
                            Assinar via PIX
                        </button>
                         <button className="w-full flex-1 text-center bg-secondary text-secondary-foreground font-semibold py-3 px-4 rounded-lg hover:bg-secondary-hover transition-colors">
                            Cancelar Assinatura
                         </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Cobrança</h2>
                     <div className="space-y-3">
                        {fallback.billingHistory.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div className="flex items-center gap-3">
                                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-semibold text-gray-700">Fatura de {item.date}</p>
                                        <p className="text-xs text-gray-500">ID: {item.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{item.amount}</p>
                                    <span className={`text-xs font-semibold ${item.status === 'Pago' ? 'text-green-600' : 'text-orange-500'}`}>{item.status}</span>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
                {qr && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold mb-2">QR Code de Pagamento</h3>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr)}`} alt="PIX" className="w-40 h-40" />
                    </div>
                )}
            </main>
        </div>
    );
};

export default SubscriptionPage;
