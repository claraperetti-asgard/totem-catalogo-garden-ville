import { useState } from 'react'
import { LeafBackground } from './Leaves'
import Revista, { ToolButton } from './Revista'
import SectionTitle from './SectionTitle'

type RevistaModalProps = {
  startPage: number
  onClose: (page: number) => void
}

/** Revista em tela cheia, com zoom de página única (lupa) como no projeto do pageflip. */
export default function RevistaModal({ startPage, onClose }: RevistaModalProps) {
  const [single, setSingle] = useState(false)
  const [page, setPage] = useState(startPage)

  return (
    <div className="fixed inset-0 z-50 flex animate-[fade_.35s_ease] flex-col overflow-hidden">
      <LeafBackground />
      <div className="relative z-10 flex items-center justify-between px-[5vw] pt-[3vh]">
        <SectionTitle>Revista Garden Ville</SectionTitle>
        <button
          onClick={() => onClose(page)}
          className="flex h-[7vw] w-[7vw] items-center justify-center rounded-full bg-white text-[3.8vw] font-bold text-[#1c5f17] shadow-lg active:scale-95"
          aria-label="Fechar revista"
        >
          ✕
        </button>
      </div>

      <div className="relative z-10 min-h-0 flex-1 px-[3vw] pt-[2vh] pb-[3vh]">
        <Revista
          key={String(single)}
          single={single}
          startPage={page}
          onPageChange={setPage}
          extras={
            <ToolButton
              label={single ? 'Ver revista aberta' : 'Ampliar página'}
              onClick={() => setSingle((s) => !s)}
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m20 20-4.8-4.8M7.5 10.5h6" />
              {!single && <path d="M10.5 7.5v6" />}
            </ToolButton>
          }
        />
      </div>

      <p className="relative z-10 pb-[2.5vh] text-center text-[2vw] font-medium text-white/80">
        Arraste o canto da página ou use as setas para folhear
      </p>
    </div>
  )
}
