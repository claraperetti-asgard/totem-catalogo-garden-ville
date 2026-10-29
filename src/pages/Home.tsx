import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { LeafBackground } from '../components/Leaves'
import LocationModal from '../components/LocationModal'
import Revista, { ToolButton } from '../components/Revista'
import RevistaModal from '../components/RevistaModal'
import SectionTitle from '../components/SectionTitle'
import TotemHeader from '../components/TotemHeader'
import { empreendimento } from '../data/gardenVille'
import { useIdleRedirect } from '../hooks/useIdleRedirect'

const IDLE_MS = 90_000

export default function Home() {
  const [page, setPage] = useState(0)
  const [revistaAberta, setRevistaAberta] = useState(false)
  const [showMap, setShowMap] = useState(false)
  // Muda a key para remontar a revista inline (volta à capa e religa o autoplay).
  const [resetKey, setResetKey] = useState(0)

  const resetScreen = useCallback(() => {
    setRevistaAberta(false)
    setShowMap(false)
    setPage(0)
    setResetKey((k) => k + 1)
  }, [])
  useIdleRedirect(IDLE_MS, '/', resetScreen)

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden font-[Montserrat,sans-serif] select-none">
      <LeafBackground />
      <TotemHeader />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-[1.6vh] px-[6vw] pt-[2.4vh] pb-[2.4vh]">
        <SectionTitle>Vídeo:</SectionTitle>
        <div className="overflow-hidden rounded-[1.2vw] border-[0.5vw] border-white/90 bg-black shadow-2xl">
          <video
            src={empreendimento.video}
            poster={empreendimento.videoPoster}
            className="aspect-video w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <div className="mt-[1vh]">
          <SectionTitle>Imagens folder:</SectionTitle>
        </div>
        <div className="min-h-0 flex-1">
          {!revistaAberta && (
            <Revista
              key={resetKey}
              autoplayInicial
              startPage={page}
              onPageChange={setPage}
              extras={
                <ToolButton label="Abrir revista em tela cheia" onClick={() => setRevistaAberta(true)}>
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                </ToolButton>
              }
            />
          )}
        </div>

        <div className="mt-[1vh] grid grid-cols-2 gap-[2.5vw]">
          <button
            onClick={() => setShowMap(true)}
            className="flex h-[7vh] items-center justify-center gap-[1.5vw] rounded-full bg-white text-[2.6vw] font-bold uppercase tracking-widest text-[#1c5f17] shadow-xl active:scale-95"
          >
            <PinIcon /> Localização
          </button>
          <Link
            to="/cadastro"
            className="flex h-[7vh] items-center justify-center rounded-full bg-[#0b3d1c] text-[2.6vw] font-bold uppercase tracking-widest text-white shadow-xl ring-[0.4vw] ring-white/80 active:scale-95"
          >
            Faça seu cadastro
          </Link>
        </div>
      </div>

      {revistaAberta && (
        <RevistaModal
          startPage={page}
          onClose={(p) => {
            setPage(p)
            setRevistaAberta(false)
          }}
        />
      )}
      {showMap && <LocationModal onClose={() => setShowMap(false)} />}
    </main>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[3.4vw] w-[3.4vw]" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  )
}
