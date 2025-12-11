// pages/api/aposta.js
import { kv } from '@vercel/kv'

const KEY = 'bolao:apostas_v1'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nome, palpite, participacao, sugestao } = req.body || {}

    if (!nome || !nome.trim() || !palpite || !participacao) {
      return res.status(400).json({ error: 'Nome completo, palpite e participação são obrigatórios.' })
    }
    if (!['menino','menina'].includes(palpite)) {
      return res.status(400).json({ error: 'Palpite inválido.' })
    }
    if (!['fralda','pix'].includes(participacao)) {
      return res.status(400).json({ error: 'Participação inválida.' })
    }

    const apostas = (await kv.get(KEY)) || []
    const nova = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,8),
      nome: nome.trim(),
      palpite,
      participacao,
      sugestao: (sugestao || '').trim() || null,
      criadoEm: new Date().toISOString()
    }
    apostas.push(nova)
    await kv.set(KEY, apostas)
    return res.status(200).json({ message: 'Aposta registrada', aposta: nova })
  }

  if (req.method === 'GET') {
    const apostas = (await kv.get(KEY)) || []
    return res.status(200).json(apostas)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'ID obrigatório para exclusão.' })
    const apostas = (await kv.get(KEY)) || []
    const novo = apostas.filter(a => a.id !== String(id))
    await kv.set(KEY, novo)
    return res.status(200).json({ message: 'Excluído' })
  }

  return res.status(405).json({ error: 'Método não permitido.' })
}
