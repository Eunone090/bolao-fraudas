// pages/index.js
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [data, setData] = useState(null)
  const [nome, setNome] = useState('')
  const [palpite, setPalpite] = useState('menino')
  const [participacao, setParticipacao] = useState('fralda')
  const [sugestao, setSugestao] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(()=>{ fetch('/api/stats').then(r=>r.json()).then(setData).catch(()=>setData(null)) },[])

  if (!data) return <div className="container"><p>Carregando...</p></div>

  const config = data.config || {}
  const revealMode = config.revealMode
  const revealGender = config.revealGender

  // Se modo revelação ativo e sexo definido -> mostrar revelação para TODO MUNDO
  if (revealMode && revealGender) {
    const vencedores = data.apostas.filter(a => a.palpite === revealGender)
    return (
      <div className="container">
        <div className="banner">
          <h1>Revelação — {revealGender === 'menino' ? 'É MENINO!' : 'É MENINA!'}</h1>
          <p className="small">Parabéns ao casal — abaixo estão as pessoas que acertaram:</p>
        </div>

        <section className="card">
          <h3>Acertadores</h3>
          {vencedores.length===0 && <div className="small">Ninguém acertou :(</div>}
          <ul>
            {vencedores.map(v => (
              <li key={v.id}><strong>{v.nome}</strong> — Sugestão: {v.sugestao || '—'}</li>
            ))}
          </ul>
        </section>

        <footer className="footer">
          <div className="small">Se precisar, peça ao admin para desativar a revelação.</div>
        </footer>
      </div>
    )
  }

  // Modo normal: mostra contagem regressiva se houver revealDate
  let diasRestantes = null
  if (config.revealDate) {
    const hoje = new Date()
    const evento = new Date(config.revealDate)
    const diff = Math.ceil((evento - hoje) / (1000*60*60*24))
    if (diff > 0) diasRestantes = diff
  }

  const enviar = async (e) => {
    e?.preventDefault()
    if (!nome || !nome.trim() || nome.trim().split(/\s+/).length < 2) { alert('Informe nome e sobrenome.'); return }
    if (!palpite) { alert('Escolha menino ou menina'); return }
    if (!participacao) { alert('Escolha fralda ou pix'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/aposta', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ nome, palpite, participacao, sugestao })
      })
      if (!res.ok) throw new Error('Erro ao enviar')
      setFeedback('Palpite enviado — obrigado!')
      setNome(''); setSugestao(''); setPalpite('menino'); setParticipacao('fralda')
      // atualizar
      const st = await fetch('/api/stats').then(r=>r.json())
      setData(st)
    } catch(err) {
      alert('Erro: ' + (err.message || err))
    } finally {
      setLoading(false)
      setTimeout(()=>setFeedback(null),3000)
    }
  }

  return (
    <div className="container">
      <div className="topbar">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Bolão de Fraldas — Alícia & Matheus</div>
          <div><Link href="/admin"><a className="btn">Área do Admin</a></Link></div>
        </div>
      </div>

      <main className="container">
        <section className="banner">
          <h1>Bolão de Fraldas da Alícia e do Matheus</h1>
          <p className="small">Aposte no sexo do bebê e, se quiser, sugira um nome. 100% das doações vão para os papais.</p>
        </section>

        <section className="card">
          <h3>🌟 Como Participar</h3>
          <p className="small">
            1️⃣ Doe fraldas para os papais! A forma principal de participar do Bolão é doando fraldas — <strong>prefira M, G ou GG</strong> (os papais não precisam do tamanho P). Você pode entregar diretamente ao casal.
          </p>
          <p className="small">
            2️⃣ Não consegue entregar fraldas? Participe via Pix! Envie o Pix no valor que desejar — de coração 💛. Envie o comprovante diretamente aos papais.
          </p>
          <div style={{marginTop:8,fontWeight:600}}>📌 Chave Pix: <u>85 99772-4197 — Alicia Cardoso de Oliveira</u></div>
          <p className="small" style={{marginTop:8}}>3️⃣ Depois de doar: preencha o formulário abaixo com seu nome completo, palpite e forma de participação.</p>
        </section>

        <section className="card">
          <h3>Enviar Palpite</h3>
          <form onSubmit={enviar}>
            <div style={{marginBottom:8}}><input className="input" placeholder="Seu nome e sobrenome (obrigatório)" value={nome} onChange={e=>setNome(e.target.value)} /></div>

            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <select className="input" value={palpite} onChange={e=>setPalpite(e.target.value)}>
                <option value="menino">Menino</option>
                <option value="menina">Menina</option>
              </select>

              <select className="input" value={participacao} onChange={e=>setParticipacao(e.target.value)}>
                <option value="fralda">Doação em fralda</option>
                <option value="pix">Pix (envie comprovante)</option>
              </select>

              <input className="input" placeholder="Sugestão de nome (opcional)" value={sugestao} onChange={e=>setSugestao(e.target.value)} />
            </div>

            <div style={{display:'flex',gap:8}}>
              <button className="btn" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Palpite'}</button>
              {feedback && <div className="small" style={{alignSelf:'center'}}>{feedback}</div>}
            </div>
          </form>
        </section>

        {diasRestantes !== null && (
          <section className="card">
            <div className="small">⏳ Faltam {diasRestantes} dias para apostar!</div>
          </section>
        )}

        <section className="card">
          <h3>Quem já apostou</h3>
          <div className="small">Total: {data.total} — Menino: {data.menino} • Menina: {data.menina}</div>
          <div style={{marginTop:8}}>
            {data.apostas.slice().reverse().map(a=>(
              <div key={a.id} className="list-item">
                <div>
                  <strong>{a.nome}</strong>
                  <div className="small">{a.sugestao ? `Sugestão: ${a.sugestao}` : ''}</div>
                </div>
                <div className="small">{new Date(a.criadoEm).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div className="small">Se precisar, peça ao admin para ativar a revelação.</div>
        </footer>
      </main>
    </div>
  )
}
