import { apiUrl } from '../api'

/** Lead como vem da API (o telefone fica guardado só com os dígitos). */
export type Lead = {
  id: number
  name: string
  telefone: string | null
  email: string | null
  created_at: string
}

/** Grava o cadastro no banco SQLite do totem. Devolve a mensagem de erro, ou null se deu certo. */
export async function saveLead(data: { nome: string; celular: string; email: string }): Promise<string | null> {
  try {
    const resposta = await fetch(apiUrl('/leads'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: data.nome, telefone: data.celular, email: data.email }),
    })
    if (resposta.ok) return null
    const corpo = await resposta.json().catch(() => null)
    return corpo?.message || 'Não foi possível salvar. Tente novamente.'
  } catch (error) {
    console.error('Erro ao salvar cadastro:', error)
    return 'Sem conexão com o servidor. Chame o responsável.'
  }
}

export async function getLeads(): Promise<Lead[]> {
  const resposta = await fetch(apiUrl('/leads'))
  if (!resposta.ok) throw new Error('Erro ao buscar respostas.')
  return resposta.json()
}

export function formatCelular(value: string | null) {
  const d = String(value || '').replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
