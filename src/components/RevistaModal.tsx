import { useCallback, useRef, useState } from 'react'
import { secoesRevista } from '../data/gardenVille'
import BotaoFechar from './BotaoFechar'
import type { FlipBookApi } from './FlipBook'
import { LeafBackground } from './Leaves'
import Revista from './Revista'
import SectionTitle from './SectionTitle'
import TotemHeader from './TotemHeader'

type RevistaModalProps = {
  startPage: number
  onClose: (page: number) => void
}

/** Revista aberta em tela cheia, com um menu que leva direto a cada seção. */
export default function RevistaModal({ startPage, onClose }: RevistaModalProps) {
  const [page, setPage] = useState(startPage)
  const api = useRef<FlipBookApi | null>(null)
  const onReady = useCallback((a: FlipBookApi) => (api.current = a), [])

  // Na revista aberta as seções começam sempre na página da esquerda (índice ímpar).
  const esquerda = page > 0 && page % 2 === 0 ? page - 1 : page
  const atual = secoesRevista.findLast((s) => s.pagina <= esquerda)

  return (
    <div className="fixed inset-0 z-50 flex animate-[fade_.35s_ease] flex-col overflow-hidden">
      <LeafBackground />
      <TotemHeader />
      <div className="absolute top-[2.6vh] right-[5vw] z-20">
        <BotaoFechar onClick={() => onClose(page)} label="Fechar revista" />
      </div>

      <div className="relative z-10 px-[6vw] pt-[4vh]">
        <SectionTitle eyebrow="Catálogo">Revista Garden Ville</SectionTitle>
      </div>

      <div className="relative z-10 mt-[3vh] px-[1vw]">
        <Revista setasDentro startPage={page} onPageChange={setPage} onReady={onReady} />
      </div>

      <nav className="relative z-10 mt-[4vh] px-[6vw]">
        <span className="text-[1.6vw] font-semibold tracking-[0.4em] text-lima uppercase">Navegue pelo catálogo</span>
        <div className="mt-[1.6vh] grid grid-cols-3 gap-[1.6vw]">
          {secoesRevista.map((s) => {
            const ativa = s === atual
            return (
              <button
                key={s.nome}
                type="button"
                onClick={() => api.current?.goTo(s.pagina)}
                className={`flex h-[5.2vh] items-center justify-between rounded-full px-[2.6vw] text-[2.2vw] font-semibold transition active:scale-95 ${
                  ativa
                    ? 'bg-lima text-gv-950 shadow-[0_1vh_3vh_rgba(166,198,56,0.3)]'
                    : 'bg-white/[0.06] text-white ring-1 ring-white/15 backdrop-blur active:bg-white/15'
                }`}
              >
                <span className="truncate">{s.nome}</span>
                <span className={`text-[1.6vw] tabular-nums ${ativa ? 'text-gv-950/60' : 'text-white/40'}`}>{s.pagina + 1}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
