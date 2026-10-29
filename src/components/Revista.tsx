import { useCallback, useRef, useState, type ReactNode } from 'react'
import { PAGE_RATIO } from '../data/gardenVille'
import FlipBook, { TOTAL_PAGES, type FlipBookApi } from './FlipBook'

type RevistaProps = {
  autoplayInicial?: boolean
  startPage?: number
  onPageChange?: (page: number) => void
  /** Botão no canto direito da linha do contador (ampliar, lupa...). */
  acao?: ReactNode
  /** Setas por cima das bordas da revista (quando ela vai de ponta a ponta da tela). */
  setasDentro?: boolean
  /** Entrega os comandos da revista (ex.: o menu da tela cheia usa o goTo). */
  onReady?: (api: FlipBookApi) => void
}

/** Revista folheável com contador de páginas em cima e setas nas laterais. */
export default function Revista({
  autoplayInicial = false,
  startPage = 0,
  onPageChange,
  acao,
  setasDentro = false,
  onReady: onReadyExterno,
}: RevistaProps) {
  const api = useRef<FlipBookApi | null>(null)
  const [page, setPage] = useState(startPage)
  const [playing, setPlaying] = useState(autoplayInicial)

  const onReady = useCallback(
    (a: FlipBookApi) => {
      api.current = a
      onReadyExterno?.(a)
    },
    [onReadyExterno],
  )
  const handlePage = (p: number) => {
    setPage(p)
    onPageChange?.(p)
  }
  // Quem mexe na revista assume o controle: o autoplay para.
  const manual = (action: () => void) => {
    setPlaying(false)
    action()
  }

  const label =
    page === 0 || page === TOTAL_PAGES - 1
      ? String(page + 1)
      : `${page + (page % 2 === 0 ? 0 : 1)}-${page + (page % 2 === 0 ? 1 : 2)}`

  return (
    <div className="flex w-full flex-col">
      <div className="relative mb-[0.6vh] flex min-h-[5vw] items-center justify-center">
        <p className="text-center text-[2.2vw] font-semibold tabular-nums tracking-wider">
          <span className="text-lima">{label}</span> <span className="text-white/50">/ {TOTAL_PAGES}</span>
        </p>
        {acao && <div className="absolute right-0">{acao}</div>}
      </div>

      {/* Altura pela proporção da revista aberta: sem sobra de espaço em volta do livro. */}
      <div className="relative w-full" style={{ aspectRatio: 2 * PAGE_RATIO }}>
        <div className="h-full w-full" onPointerDown={() => setPlaying(false)}>
          <FlipBook autoplay={playing} startPage={startPage} onPageChange={handlePage} onReady={onReady} />
        </div>
        <Seta dentro={setasDentro} lado="esquerda" label="Página anterior" onClick={() => manual(() => api.current?.prev())}>
          <path d="M15 5 8 12l7 7" />
        </Seta>
        <Seta dentro={setasDentro} lado="direita" label="Próxima página" onClick={() => manual(() => api.current?.next())}>
          <path d="m9 5 7 7-7 7" />
        </Seta>
      </div>
    </div>
  )
}

/** Botão redondo pequeno, para a `acao` da revista. */
export function BotaoRevista({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-[5vw] w-[5vw] items-center justify-center rounded-full bg-gv-950/80 text-white ring-1 ring-white/30 backdrop-blur transition active:scale-90 active:bg-lima active:text-gv-950"
    >
      <svg viewBox="0 0 24 24" className="h-[2.6vw] w-[2.6vw]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}

type SetaProps = { dentro: boolean; lado: 'esquerda' | 'direita'; label: string; onClick: () => void; children: ReactNode }

function Seta({ dentro, lado, label, onClick, children }: SetaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-[8vw] w-[8vw] -translate-y-1/2 items-center justify-center rounded-full bg-gv-950/80 text-white shadow-xl ring-1 ring-white/30 backdrop-blur transition active:scale-90 active:bg-lima active:text-gv-950 ${
        lado === 'esquerda' ? (dentro ? 'left-[2vw]' : '-left-[4.5vw]') : dentro ? 'right-[2vw]' : '-right-[4.5vw]'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-[4vw] w-[4vw]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}
