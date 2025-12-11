// pages/index.js
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Função para capitalizar a primeira letra de cada palavra
const capitalizeWords = (str) => {
  if (!str) return str;
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

export default function Home() {
// ... (restante do código)

  // ... (restante do código)

  // Se modo revelação ativo e sexo definido -> mostrar revelação para TODO MUNDO
  if (revealMode && revealGender) {
    const isBoy = revealGender === 'menino';
    const corFundo = isBoy ? 'var(--boy)' : 'var(--girl)';
    const corBorda = isBoy ? 'var(--boy-border)' : 'var(--girl-border)';
    const vencedores = data.apostas.filter(a => a.palpite === revealGender)

    return (
      <div className="container">
        
        {/* NOVO DESIGN: Banner com cores temáticas */}
        <div className="banner" style={{ backgroundColor: corFundo, border: `2px solid ${corBorda}` }}>
          <h1>🎉 REVELAÇÃO 🎉</h1>
          <h2>{isBoy ? 'É UM MENINO!' : 'É UMA MENINA!'}</h2>
          <p className="small">Parabéns ao casal — abaixo estão as pessoas que acertaram o palpite:</p>
        </div>

        <section className="card">
          <h3>Palpites Vencedores</h3> 
          {vencedores.length===0 && <div className="small">Ninguém acertou :(</div>}
          <ul className="vencedores-lista">
            {vencedores.map(v => (
              <li key={v.id} className={isBoy ? 'vencedor-boy' : 'vencedor-girl'}>
                <strong>{v.nome.toUpperCase()}</strong> 
                {v.sugestao && ` — Sugestão: ${capitalizeWords(v.sugestao)}`} {/* Capitalização aqui */}
              </li>
            ))}
          </ul>
        </section>

        <footer className="footer">
          {/* Link discreto para o Admin */}
          <div className="small">Se precisar, peça ao <Link href="/admin"><a>admin</a></Link> para desativar a revelação.</div>
        </footer>
      </div>
    )
  }

  // ... (restante do código)

  return (
    <div className="topbar-wrapper">
      
      {/* Topbar Original */}
      <div className="topbar">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Bolão de Fraldas — Alícia & Matheus</div>
          <div><Link href="/admin"><a className="btn">Admin</a></Link></div> 
        </div>
      </div>
      
      {/* Barra de Progresso no Topo */}
      <div className="progress">
      {/* ... (código da barra de progresso) */}
      </div>
      
      <main className="container">
        {/* ... (seções de Banner e Como Participar) */}

        <section className="card">
          <h3>Enviar Palpite</h3>
          <form onSubmit={enviar}>
            <div style={{marginBottom:8}}><input className="input" placeholder="Seu nome e sobrenome (obrigatório)" value={nome} onChange={e=>setNome(e.target.value)} /></div>

            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <select className="input" value={palpite} onChange={e=>setPalpite(e.target.value)}>
                <option value="menino">{capitalizeWords('menino')}</option> {/* Capitalização aqui */}
                <option value="menina">{capitalizeWords('menina')}</option> {/* Capitalização aqui */}
              </select>

              <select className="input" value={participacao} onChange={e=>setParticipacao(e.target.value)}>
                <option value="fralda">Doação em Fralda</option>
                <option value="pix">Pix</option>
              </select>

              <input className="input" placeholder="Sugestão de nome (opcional)" value={sugestao} onChange={e=>setSugestao(e.target.value)} />
            </div>
            
            {/* ... (botões de envio) */}
          </form>
        </section>
        
        {/* ... (seção de dias restantes) */}

        <section className="card">
          <h3>Quem já apostou</h3>
          <div className="small">Total: {data.total} — Menino: {data.menino} • Menina: {data.menina}</div>
          <div style={{marginTop:8}}>
            {data.apostas.slice().reverse().map(a=>(
              // Adiciona a tag de palpite (Menino/Menina) e nome em caixa alta
              <div key={a.id} className="list-item">
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <div className={`palpite-tag ${a.palpite === 'menino' ? 'tag-boy' : 'tag-girl'}`}>
                    {capitalizeWords(a.palpite)} {/* Capitalização aqui */}
                  </div>
                  <div>
                    <strong>{a.nome.toUpperCase()}</strong> 
                    <div className="small">{a.sugestao ? `Sugestão: ${capitalizeWords(a.sugestao)}` : ''}</div> {/* Capitalização aqui */}
                  </div>
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
