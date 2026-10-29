export type Lead = {
  nome: string
  celular: string
  email: string
  criadoEm: string
}

const STORAGE_KEY = 'garden-ville:leads'

/** Opcional: defina VITE_LEADS_ENDPOINT no .env para enviar os cadastros para um servidor/webhook. */
const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined

export function getLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Lead[]
  } catch {
    return []
  }
}

export function clearLeads() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function saveLead(data: Omit<Lead, 'criadoEm'>) {
  const lead: Lead = { ...data, criadoEm: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...getLeads(), lead]))

  if (ENDPOINT) {
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, empreendimento: 'Garden Ville Residence' }),
      })
    } catch {
      // Sem internet: o cadastro continua salvo no totem.
    }
  }
}

export function leadsToCsv(leads: Lead[]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = leads.map((l) =>
    [l.nome, l.celular, l.email, new Date(l.criadoEm).toLocaleString('pt-BR')].map(escape).join(';'),
  )
  return ['Nome;Celular;Email;Data', ...rows].join('\n')
}

export function formatCelular(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
