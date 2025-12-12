// pages/admin.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const ADMIN_PASSWORD = 'olivervemai'

export default function Admin(){
  const [pwd, setPwd] = useState('')
  const [auth, setAuth] = useState(false)
  const [data, setData] = useState(null)
  const router = useRouter()

  useEffect(()=>{ if(auth) load() },[auth])

  const load = async () => {
    const res = await fetch('/api/stats')
    const json = await res.json()
    setData(json)
  }

  const tryLogin = () => {
    if(pwd === ADMIN_PASSWORD){ 
        setAuth(true); 
        setPwd('') 
    } else { 
        alert('Sai daqui, curioso.') 
    }
  }

  const activateReveal = async () => {
    await fetch('/api/config', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action: 'activateReveal' }) })
    load()
  }

  const setRevealGender = async (gender) => {
    await fetch('/api/config', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ revealGender: gender }) })
    load()
  }

  const deactivateReveal = async () => {
    await fetch('/api/config', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action: 'deactivateReveal' }) })
    load()
  }

  const setRevealDate = async (date) => {
    await fetch('/api/config', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ revealDate: date }) })
    load()
  }

  const excluir = async (id) => {
    if(!confirm('Remover essa aposta?')) return
    await fetch('/api/aposta?id=' + encodeURIComponent(id), { method:'DELETE' })
    load()
  }

  const exportCSV = () => {
    const apostas = data.apostas || []
    const rows = [['id','nome','palpite','participacao','sugestao','criadoEm']]
    apostas.forEach(a=>rows.push([a.id,a.nome,a.palpite,a.participacao,a.sugestao||'',a.criadoEm]))
    const csv = rows.map(r=>r.map(c=>`"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\\n')
    const blob = new Blob([csv],{type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'apostas.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if(!auth) return (
    <div className="container">
      <h2>Painel Admin — Login</h2>
      <input className="input" type="password" placeholder="Senha" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <div style={{marginTop:8}}>
        <button className="btn" onClick={tryLogin}>Entrar</button>
        {/* Botão Voltar na tela de Login */}
        <button className="btn" style={{background:'#6b7280', marginLeft:8}} onClick={()=>router.push('/')}>Voltar ao Site</button> 
      </div>
    </div>
  )

  if(!data) return <div className="container"><p>Carregando...</p></div>

  const config = data.config || {}

  return (
    <div className="container">
      <div className="card">
        
        {/* Título e botão Voltar no painel principal */}
        <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Painel Admin</h2>
            <button className="btn" style={{background:'#6b7280', alignSelf:'flex-start'}} onClick={()=>router.push('/')}>Voltar ao Site</button>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:12}}>
          <button className="btn" onClick={exportCSV}>Exportar CSV</button>
          <button className="btn" onClick={()=>{navigator.clipboard.writeText(JSON.stringify(data.apostas || [])); alert('Copiado JSON')}}>Copiar JSON</button>
        </div>

        {/* NOVO: Tabela de Resumo de Estatísticas, dividida por subgrupos */}
        <section style={{marginTop: 12, display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
            <div>
                <h3>Total Geral</h3>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Total de Apostas</th>
                            <td>{data.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div>
                <h3>Palpites (Menino/Menina)</h3>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Menino</th>
                            <td>{data.menino}</td>
                        </tr>
                        <tr>
                            <th>Menina</th>
                            <td>{data.menina}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Tipo de Participação</h3>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Fralda</th>
                            <td>{data.fralda}</td>
                        </tr>
                        <tr>
                            <th>Pix</th>
                            <td>{data.pix}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        
        <div style={{marginTop:12}}>
          {!config.revealMode ? (
            <>
              <h3>Modo Revelação</h3>
              <button className="btn" onClick={activateReveal}>Ativar modo revelação</button>

              <h3 style={{marginTop:12}}>Data da contagem regressiva</h3>
              <input className="input" type="date" onChange={e=>setRevealDate(e.target.value)} defaultValue={config.revealDate||''} />
            </>
          ) : (
            <>
              <h3>Modo Revelação ATIVO</h3>
              <div style={{display:'flex',gap:8,marginBottom:8}}>
                <button className="btn" onClick={()=>setRevealGender('menino')}>Revelar Menino</button>
                <button className="btn" onClick={()=>setRevealGender('menina')}>Revelar Menina</button>
                <button className="btn" style={{background:'#d9534f'}} onClick={deactivateReveal}>Voltar ao modo normal</button>
              </div>
              <div className="small">Obs: ao escolher Menino/Menina o site mostrará automaticamente os acertadores.</div>
            </>
          )}
        </div>

        <section style={{marginTop:16}}>
          <h3>Lista de apostas</h3>
          <table className="table">
            <thead><tr><th>Nome</th><th>Palpite</th><th>Participação</th><th>Sugestão</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {data.apostas.map(a=>(
                <tr key={a.id}>
                  <td>{a.nome.toUpperCase()}</td> 
                  <td>{a.palpite}</td>
                  <td>{a.participacao}</td>
                  <td>{a.sugestao || '-'}</td>
                  <td>{new Date(a.criadoEm).toLocaleString()}</td>
                  <td><button className="btn" onClick={()=>excluir(a.id)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  )
}
