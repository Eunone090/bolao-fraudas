// pages/admin.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Função para capitalizar a primeira letra de cada palavra
const capitalizeWords = (str) => {
  if (!str) return str;
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

const ADMIN_PASSWORD = 'olivervemai'

export default function Admin(){
  const [pwd, setPwd] = useState('')
  const [auth, setAuth] = useState(false)
// ... (restante do código)

  return (
    <div className="container">
      <div className="card">
        
        {/* Título e botão Voltar no painel principal */}
        <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Painel Admin</h2>
            <button className="btn" style={{background:'#6b7280', alignSelf:'flex-start'}} onClick={()=>router.push('/')}>Voltar ao Site</button>
        </div>

        {/* ... (botões de exportação) */}

        {/* NOVO: Tabela de Resumo de Estatísticas, dividida por subgrupos */}
        <section style={{marginTop: 12, display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
            <div>
                <h3>Total Geral</h3>
                <table className="table">
                {/* ... (tabela total) */}
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
        {/* ... (código modo revelação) */}
        </div>

        <section style={{marginTop:16}}>
          <h3>Lista de apostas</h3>
          <table className="table">
            <thead><tr><th>Nome</th><th>Palpite</th><th>Participação</th><th>Sugestão</th><th>Data</th><th>Ações</th></tr></thead>
            <tbody>
              {data.apostas.map(a=>(
                <tr key={a.id}>
                  <td>{a.nome.toUpperCase()}</td> 
                  <td>{capitalizeWords(a.palpite)}</td> {/* Capitalização aqui */}
                  <td>{capitalizeWords(a.participacao)}</td> {/* Capitalização aqui */}
                  <td>{capitalizeWords(a.sugestao || '-')}</td> {/* Capitalização aqui */}
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
