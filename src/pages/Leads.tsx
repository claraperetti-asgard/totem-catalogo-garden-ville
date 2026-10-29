import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clearLeads, getLeads, leadsToCsv } from '../lib/leads'

/** Tela administrativa (acesse /leads) para exportar os cadastros salvos no totem. */
export default function Leads() {
  const [leads, setLeads] = useState(getLeads)

  function exportar() {
    const blob = new Blob(['﻿' + leadsToCsv(leads)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `leads-garden-ville-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function limpar() {
    if (!window.confirm('Apagar todos os cadastros deste totem?')) return
    clearLeads()
    setLeads([])
  }

  return (
    <main className="min-h-screen bg-emerald-50 p-8 text-emerald-950">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">Cadastros Garden Ville ({leads.length})</h1>
        <button onClick={exportar} className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white">
          Exportar CSV
        </button>
        <button onClick={limpar} className="rounded bg-red-600 px-4 py-2 font-semibold text-white">
          Limpar
        </button>
        <Link to="/" className="ml-auto underline">
          Voltar ao totem
        </Link>
      </div>
      <table className="w-full border-collapse bg-white text-left text-sm shadow">
        <thead className="bg-emerald-800 text-white">
          <tr>
            <th className="p-2">Nome</th>
            <th className="p-2">Celular</th>
            <th className="p-2">E-mail</th>
            <th className="p-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.criadoEm} className="border-b">
              <td className="p-2">{l.nome}</td>
              <td className="p-2">{l.celular}</td>
              <td className="p-2">{l.email}</td>
              <td className="p-2">{new Date(l.criadoEm).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
