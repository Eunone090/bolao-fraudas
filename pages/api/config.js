// pages/api/config.js
import { kv } from '@vercel/kv'

const C_KEY = 'bolao:config_v1'
const A_KEY = 'bolao:apostas_v1'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const config = (await kv.get(C_KEY)) || { revealMode: false, revealGender: null, revealDate: null }
    return res.status(200).json(config)
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    const config = (await kv.get(C_KEY)) || { revealMode: false, revealGender: null, revealDate: null }

    // actions: activateReveal, deactivateReveal, setGender, setDate
    if (body.action === 'activateReveal') {
      config.revealMode = true
    } else if (body.action === 'deactivateReveal') {
      config.revealMode = false
      config.revealGender = null
    }
    if (body.revealGender) config.revealGender = body.revealGender
    if (body.revealDate) config.revealDate = body.revealDate

    await kv.set(C_KEY, config)
    return res.status(200).json(config)
  }

  return res.status(405).json({ error: 'Método não permitido.' })
}
