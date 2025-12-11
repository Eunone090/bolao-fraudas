// pages/api/stats.js
import { kv } from '@vercel/kv'

const A_KEY = 'bolao:apostas_v1'
const C_KEY = 'bolao:config_v1'

export default async function handler(req, res) {
  const apostas = (await kv.get(A_KEY)) || []
  const config = (await kv.get(C_KEY)) || { revealMode: false, revealGender: null, revealDate: null }

  const total = apostas.length
  const menino = apostas.filter(a => a.palpite === 'menino').length
  const menina = apostas.filter(a => a.palpite === 'menina').length

  res.status(200).json({
    total,
    menino,
    menina,
    porcentagemMenino: total ? Math.round((menino/total)*100) : 0,
    porcentagemMenina: total ? Math.round((menina/total)*100) : 0,
    fralda: apostas.filter(a=>a.participacao==='fralda').length,
    pix: apostas.filter(a=>a.participacao==='pix').length,
    apostas,
    config
  })
}
