import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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

export default function Admin(){
  const [data, setData] = useState({ apostas: [] })
  const [pwd, setPwd] = useState('')
  const [auth, setAuth] = useState(false)
  const router = useRouter()

  useEffect(()=>{
    setData(loadData())
  },[])

  useEffect(()=>{
    if(typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },[data])

  const tryLogin = () => {
    if(pwd === ADMIN_PASSWORD){ setAuth(true); setPwd('') } else { alert('Senha incorreta') }
  }

  const excluir = (id) => {
    if(!confirm('Remover essa aposta?')) return;
    setData({...data, apostas: data.apostas.filter(a=>a.id!==id)})
  }

  const exportCSV = () => {
    const rows = [['nome','palpite','sugestao','criadoEm']]
    data.apostas.forEach(a=>rows.push([a.nome,a.palpite,a.sugestao||'',a.criadoEm]))
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\\n')
    const blob = new Blob([csv],{type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'apostas.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <div className="card">
        {!auth ? (
          <div>
            <h2>Painel Admin — Login</h2>
            <input className="input" placeholder="Senha" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
            <div style={{marginTop:8}}>
              <button className="btn" onClick={tryLogin}>Entrar</button>
              <button className="btn" style={{background:'#6b7280', marginLeft:8}} onClick={()=>router.push('/')}>Voltar</button>
            </div>
          </div>
        ) : (
          <div>
            <h2>Painel Admin</h2>
            <div style={{display:'flex',gap:8, marginBottom:12}}>
              <button className="btn" onClick={exportCSV}>Exportar CSV</button>
              <button className="btn" onClick={()=>{navigator.clipboard.writeText(JSON.stringify(data)); alert('Copiado JSON')}}>Copiar JSON</button>
              <button className="btn" style={{background:'#d9534f'}} onClick={()=>{
                if(confirm('Limpar todos os dados?')){ localStorage.removeItem(STORAGE_KEY); setData({apostas: []}); alert('Dados limpos') }
              }}>Limpar tudo</button>
            </div>

            <div>
              <h4>Total de apostas: {data.apostas.length}</h4>
              <h4>Menino: {data.apostas.filter(a=>a.palpite==='menino').length} — Menina: {data.apostas.filter(a=>a.palpite==='menina').length}</h4>
            </div>

            <table className="table" style={{marginTop:12}}>
              <thead><tr><th>Nome</th><th>Palpite</th><th>Sugestão</th><th>Data</th><th>Ações</th></tr></thead>
              <tbody>
                {data.apostas.map(a=>(
                  <tr key={a.id}>
                    <td>{a.nome}</td>
                    <td>{a.palpite}</td>
                    <td>{a.sugestao || ''}</td>
                    <td>{new Date(a.criadoEm).toLocaleString()}</td>
                    <td><button className="btn" onClick={()=>excluir(a.id)}>Excluir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  )
}
