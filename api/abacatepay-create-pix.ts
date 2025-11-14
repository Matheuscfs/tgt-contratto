import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const { amount, description } = req.body || {}
    const key = process.env.ABACATEPAY_API_KEY
    if (!key) {
      res.status(500).json({ error: 'Missing API key' })
      return
    }
    const r = await fetch('https://api.abacatepay.com/payments/pix', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, description }),
    })
    if (!r.ok) {
      const text = await r.text()
      res.status(r.status).send(text)
      return
    }
    const data = await r.json()
    res.status(200).json(data)
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to create PIX' })
  }
}
