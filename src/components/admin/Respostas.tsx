import { useCallback, useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { formatCelular, getLeads, type Lead } from '../../lib/leads'

const COLUNAS = ['ID', 'Nome', 'Celular', 'E-mail', 'Data']

const vazio = (valor: string | null) => (valor && valor.trim() ? valor : '—')

/** Tabela com os cadastros do totem e o botão de exportar para Excel. */
export default function Respostas() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const buscar = useCallback(
    () =>
      getLeads()
        .then(setLeads)
        .catch((error) => {
          console.error('Erro ao carregar respostas:', error)
          setErro('Não foi possível carregar os dados. Verifique se o servidor está rodando.')
        })
        .finally(() => setCarregando(false)),
    [],
  )

  useEffect(() => {
    buscar()
  }, [buscar])

  const carregar = () => {
    setCarregando(true)
    setErro('')
    buscar()
  }

  // Planilha gerada no próprio totem, como nos outros projetos.
  const exportar = () => {
    const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
    try {
      const planilha = XLSX.utils.json_to_sheet(
        leads.map((lead) => ({
          ID: lead.id,
          Nome: lead.name,
          Celular: formatCelular(lead.telefone),
          'E-mail': lead.email || '',
          Data: lead.created_at,
        })),
      )
      const livro = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(livro, planilha, 'Leads')
      XLSX.writeFile(livro, `leads-garden-ville-${data}.xlsx`)
    } catch (error) {
      console.error('Erro ao exportar planilha:', error)
      setErro('Não foi possível gerar a planilha.')
    }
  }

  const botao =
    'flex items-center justify-center gap-[1.4vw] rounded-full px-[4vw] h-[5.4vh] text-[2.2vw] font-bold transition active:scale-95 disabled:opacity-50'

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-[3.4vw] bg-gv-950/45 p-[4vw] shadow-[0_2vh_6vh_rgba(0,0,0,0.35)] ring-1 ring-white/12 backdrop-blur-md">
      <div className="flex flex-wrap items-end justify-between gap-[2vw]">
        <div>
          <h2 className="font-display text-[4.4vw] leading-tight">Leads captados</h2>
          <p className="text-[2.2vw] text-white/60">{carregando ? 'Carregando...' : `${leads.length} cadastro(s)`}</p>
        </div>

        <div className="flex gap-[2vw]">
          <button type="button" onClick={carregar} disabled={carregando} className={`${botao} bg-white/10 ring-1 ring-white/25`}>
            <svg viewBox="0 0 24 24" className="h-[2.6vw] w-[2.6vw]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4" />
            </svg>
            Atualizar
          </button>
          <button type="button" onClick={exportar} disabled={carregando || leads.length === 0} className={`${botao} bg-lima text-gv-950`}>
            <svg viewBox="0 0 24 24" className="h-[2.6vw] w-[2.6vw]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
            Exportar planilha
          </button>
        </div>
      </div>

      {erro && <p className="mt-[2vh] text-[2.2vw] font-semibold text-[#ffd37a]">{erro}</p>}

      {/* A tabela rola dentro da própria caixa: o resto da tela do totem fica travado. */}
      <div className="mt-[2.4vh] min-h-0 flex-1 touch-pan-y overflow-auto rounded-[2vw] bg-black/25 ring-1 ring-white/10">
        <table className="w-full border-collapse text-left text-[2vw]">
          <thead className="sticky top-0 bg-gv-950">
            <tr className="border-b border-white/15 text-[1.7vw] tracking-[0.15em] text-lima uppercase">
              {COLUNAS.map((coluna) => (
                <th key={coluna} className="px-[2vw] py-[1.4vh] font-bold whitespace-nowrap">
                  {coluna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan={COLUNAS.length} className="px-[2vw] py-[5vh] text-center text-white/60">
                  Carregando...
                </td>
              </tr>
            )}
            {!carregando && !erro && leads.length === 0 && (
              <tr>
                <td colSpan={COLUNAS.length} className="px-[2vw] py-[5vh] text-center text-white/60">
                  Nenhum cadastro ainda.
                </td>
              </tr>
            )}
            {!carregando &&
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/10 last:border-b-0">
                  <td className="px-[2vw] py-[1.2vh] text-white/50">{lead.id}</td>
                  <td className="px-[2vw] py-[1.2vh] font-semibold whitespace-nowrap">{lead.name}</td>
                  <td className="px-[2vw] py-[1.2vh] whitespace-nowrap">{vazio(formatCelular(lead.telefone))}</td>
                  <td className="px-[2vw] py-[1.2vh]">{vazio(lead.email)}</td>
                  <td className="px-[2vw] py-[1.2vh] whitespace-nowrap text-white/60">{lead.created_at}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
