import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'bolao_next_data_v1'
const ADMIN_PASSWORD = 'olivervemai'

function loadData(){
  try{
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if(!raw) return { apostas: [] }
    return JSON.parse(raw)
  }catch(e){
    return { apostas: [] }
  }
}

export default function Home(){
  const [data, setData] = useState({ apostas: [] })
  const [nome, setNome] = useState('')
  const [palpite, setPalpite] = useState('menino')
  const [sugestao, setSugestao] = useState('')

  useEffect(()=>{
    setData(loadData())
  },[])

  useEffect(()=>{
    if(typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },[data])

  const totals = () => {
    const total = data.apostas.length
    const m = data.apostas.filter(a=>a.palpite==='menino').length
    const f = data.apostas.filter(a=>a.palpite==='menina').length
    const mPerc = total ? Math.round((m/total)*100) : 0
    const fPerc = total ? Math.round((f/total)*100) : 0
    return { total, m, f, mPerc, fPerc }
  }

  const addAposta = (e) => {
    e.preventDefault()
    const nova = {
      id: Date.now().toString(36),
      nome: nome.trim() || 'Anônimo',
      palpite,
      sugestao: sugestao.trim() || '',
      criadoEm: new Date().toISOString()
    }
    setData({...data, apostas: [...data.apostas, nova]})
    setNome(''); setSugestao('')
    alert('Palpite enviado — obrigado por celebrar com Alícia e Matheus!')
  }

  const { total, m, f, mPerc, fPerc } = totals()

  return (
    <div>
      <div className="topbar">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Bolão de Fraldas — Alícia & Matheus</div>
          <div>
            <Link href="/admin"><a className="btn">Área do Administrador</a></Link>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
            <div style={{width: mPerc + '%', background:'#3b82f6'}}>{mPerc>0?mPerc+'% Menino':''}</div>
            <div style={{width: fPerc + '%', background:'#ec4899'}}>{fPerc>0?fPerc+'% Menina':''}</div>
          </div>
        </div>
      </div>

      <main className="container">
        <section className="banner">
          <h1>Bolão de Fraldas da Alícia e do Matheus</h1>
          <p className="small">Aposte no sexo do bebê e, se quiser, sugira um nome. 100% das doações vão para os papais.</p>
        </section>

        <section className="card">
          <h3>Como Participar</h3>
          <p className="small">Não consegue entregar fralda? Que tal fazer o Pix pros papais comprarem? Fique à vontade quanto ao valor.</p>
          <div style={{marginTop:8,fontWeight:600}}>Chave Pix: <u>85 99772-4197 — Alicia Cardoso de Oliveira</u></div>
          <p className="small" style={{marginTop:8}}>Observação: os papais não precisam de fraldas tamanho P — prefira M, G ou GG.</p>
        </section>

        <section className="card">
          <h3>Enviar Palpite</h3>
          <form onSubmit={addAposta}>
            <div style={{marginBottom:8}}>
              <input className="input" placeholder="Seu nome (opcional)" value={nome} onChange={e=>setNome(e.target.value)} />
            </div>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <select className="input" value={palpite} onChange={e=>setPalpite(e.target.value)}>
                <option value="menino">Menino</option>
                <option value="menina">Menina</option>
              </select>
              <input className="input" placeholder="Sugestão de nome (opcional)" value={sugestao} onChange={e=>setSugestao(e.target.value)} />
            </div>
            <button className="btn" type="submit">Enviar Palpite</button>
          </form>
        </section>

        <section className="card">
          <h3>Quem já apostou</h3>
          <div style={{marginBottom:8}} className="small">Total: {total} — Menino: {m} • Menina: {f}</div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="card" style={{padding:12}}>
              <h4>Menino</h4>
              {data.apostas.filter(a=>a.palpite==='menino').map(a=>(
                <div key={a.id} className="list-item">
                  <div>
                    <span className={ "tooltip boy" }>
                      <strong>{a.nome}</strong>
                      <span className="tooltiptext">{a.sugestao ? `Eu sugeri: ${a.sugestao}` : 'Sem sugestão'}</span>
                    </span>
                  </div>
                  <div className="small">{new Date(a.criadoEm).toLocaleString()}</div>
                </div>
              ))}
              {data.apostas.filter(a=>a.palpite==='menino').length===0 && <div className="small">Sem apostas ainda</div>}
            </div>

            <div className="card" style={{padding:12}}>
              <h4>Menina</h4>
              {data.apostas.filter(a=>a.palpite==='menina').map(a=>(
                <div key={a.id} className="list-item">
                  <div>
                    <span className={ "tooltip girl" }>
                      <strong>{a.nome}</strong>
                      <span className="tooltiptext">{a.sugestao ? `Eu sugeri: ${a.sugestao}` : 'Sem sugestão'}</span>
                    </span>
                  </div>
                  <div className="small">{new Date(a.criadoEm).toLocaleString()}</div>
                </div>
              ))}
              {data.apostas.filter(a=>a.palpite==='menina').length===0 && <div className="small">Sem apostas ainda</div>}
            </div>
          </div>
        </section>

        <section className="card">
          <h3>Regras</h3>
          <ul>
            <li className="small">Brincadeira festiva, sem fins lucrativos.</li>
            <li className="small">100% das doações serão entregues à Alícia e ao Matheus.</li>
            <li className="small">Os dados pessoais são só para contato e organização.</li>
          </ul>
        </section>

        <footer className="footer">
          <div className="small">Se precisar, acesse a <a href="/admin">área do admin</a>.</div>
        </footer>
      </main>
    </div>
  )
}
