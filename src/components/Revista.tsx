import { useCallback, useRef, useState, type ReactNode } from 'react'
import FlipBook, { TOTAL_PAGES, type FlipBookApi } from './FlipBook'

type RevistaProps = {
  single?: boolean
  autoplayInicial?: boolean
  startPage?: number
  onPageChange?: (page: number) => void
  /** Botões extras na barra (tela cheia, zoom, fechar...). */
  extras?: ReactNode
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Revista folheável + barra de controles, no estilo do vídeo de inspiração. */
export default function Revista({ single = false, autoplayInicial = false, startPage = 0, onPageChange, extras }: RevistaProps) {
  const api = useRef<FlipBookApi | null>(null)
  const [page, setPage] = useState(startPage)
  const [playing, setPlaying] = useState(autoplayInicial)

  const onReady = useCallback((a: FlipBookApi) => (api.current = a), [])
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
    single || page === 0 || page === TOTAL_PAGES - 1
      ? pad(page + 1)
      : `${pad(page + (page % 2 === 0 ? 0 : 1))}-${pad(page + (page % 2 === 0 ? 1 : 2))}`

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative min-h-0 flex-1" onPointerDown={() => setPlaying(false)}>
        <FlipBook
          single={single}
          autoplay={playing}
          startPage={startPage}
          onPageChange={handlePage}
          onReady={onReady}
        />
      </div>

      <div className="mx-auto mt-[1.2vh] flex items-center gap-[1.4vw] rounded-full bg-[#0b3d1c]/80 px-[2vw] py-[0.8vh] text-white shadow-xl ring-1 ring-white/20">
        <ToolButton label="Página anterior" onClick={() => manual(() => api.current?.prev())}>
          <path d="M15 5 8 12l7 7" />
        </ToolButton>
        <ToolButton label={playing ? 'Pausar' : 'Folhear automaticamente'} onClick={() => setPlaying((p) => !p)}>
          {playing ? <path d="M9 5v14M15 5v14" /> : <path d="M8 5v14l11-7Z" fill="currentColor" />}
        </ToolButton>
        <span className="min-w-[11vw] text-center text-[2.2vw] font-bold tabular-nums tracking-wider">
          {label} <span className="opacity-60">/ {pad(TOTAL_PAGES)}</span>
        </span>
        <ToolButton label="Voltar para a capa" onClick={() => manual(() => api.current?.goTo(0))}>
          <path d="M4 11 12 4l8 7M6 10v10h12V10" />
        </ToolButton>
        <ToolButton label="Próxima página" onClick={() => manual(() => api.current?.next())}>
          <path d="m9 5 7 7-7 7" />
        </ToolButton>
        {extras}
      </div>
    </div>
  )
}

export function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-[5.4vw] w-[5.4vw] items-center justify-center rounded-full bg-white/10 transition active:scale-90 active:bg-[#a6c638]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[3vw] w-[3vw]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  )
}
