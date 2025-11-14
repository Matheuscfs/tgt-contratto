import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false })
    return
  }
  const secret = process.env.ABACATEPAY_WEBHOOK_SECRET
  const url = process.env.VITE_SUPABASE_URL as string
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!secret || !url || !serviceRole) {
    res.status(500).json({ ok: false })
    return
  }
  const signature = req.headers['x-abacate-signature'] as string | undefined
  if (!signature) {
    res.status(400).json({ ok: false })
    return
  }
  const event = req.body
  const supabase = createClient(url, serviceRole)
  if (event?.type === 'payment.confirmed') {
    const companyId = event.data?.company_id
    const amount = event.data?.amount
    const chargeId = event.data?.id
    await supabase
      .from('subscriptions')
      .update({ status: 'Ativa', abacate_charge_id: chargeId })
      .eq('company_id', companyId)
    await supabase
      .from('billing_history')
      .insert({ company_id: companyId, amount, status: 'Pago', date: new Date().toISOString() })
  }
  res.status(200).json({ ok: true })
}
