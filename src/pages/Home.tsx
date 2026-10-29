import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { LeafBackground } from '../components/Leaves'
import LocationModal from '../components/LocationModal'
import MapaInterativo from '../components/MapaInterativo'
import Revista, { BotaoRevista } from '../components/Revista'
import RevistaModal from '../components/RevistaModal'
import TotemHeader from '../components/TotemHeader'
import { empreendimento } from '../data/gardenVille'
import { useIdleRedirect } from '../hooks/useIdleRedirect'

const IDLE_MS = 90_000

export default function Home() {
  const [showMap, setShowMap] = useState(false)
  const [revistaAberta, setRevistaAberta] = useState(false)
  const [page, setPage] = useState(0)
  // Muda a key para remontar a revista inline (volta à capa e religa o autoplay).
  const [resetKey, setResetKey] = useState(0)

  const resetScreen = useCallback(() => {
    setShowMap(false)
    setRevistaAberta(false)
    setPage(0)
    setResetKey((k) => k + 1)
  }, [])
  useIdleRedirect(IDLE_MS, '/', resetScreen)

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden font-sans select-none">
      <LeafBackground />
      <TotemHeader />
      <Link
        to="/"
        aria-label="Voltar para a tela de descanso"
        className="absolute top-[3.4vh] left-[5vw] z-20 flex h-[8vw] w-[8vw] items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur active:scale-90 active:bg-lima active:text-gv-950"
      >
        <svg viewBox="0 0 24 24" className="h-[3.4vw] w-[3.4vw]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </Link>

      {/* Ordem combinada com o cliente: revista, mapa, vídeo e cadastro. */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between gap-[1.6vh] px-[6vw] pt-[2.4vh] pb-[2.4vh]">
        <div className="shrink-0">
          <h2 className="mb-[1vh] text-center font-display text-[4.4vw] leading-tight text-white">Confira nosso catálogo:</h2>
          {/* Some enquanto a tela cheia está aberta e volta na página em que a pessoa parou. */}
          {!revistaAberta && (
            <Revista
              key={resetKey}
              autoplayInicial={page === 0}
              startPage={page}
              onPageChange={setPage}
              acao={
                <BotaoRevista label="Abrir revista em tela cheia" onClick={() => setRevistaAberta(true)}>
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                </BotaoRevista>
              }
            />
          )}
        </div>

        <div className="relative h-[15vh] shrink-0 overflow-hidden rounded-[2.4vw] shadow-[0_2vh_5vh_rgba(0,0,0,0.45)] ring-1 ring-white/15">
          {!showMap && <MapaInterativo key={resetKey} previa />}
          <div className="pointer-events-none absolute top-[1.4vw] left-[1.4vw] flex items-center gap-[1.4vw] rounded-[1.6vw] bg-gv-900/90 py-[0.8vh] pr-[2.4vw] pl-[1.4vw] text-white shadow-lg backdrop-blur">
            <span className="flex h-[4vh] w-[4vh] items-center justify-center rounded-[1.2vw] bg-lima text-gv-950">
              <PinIcon />
            </span>
            <span className="flex flex-col">
              <span className="text-[2vw] leading-tight font-bold">{empreendimento.endereco}</span>
              <span className="text-[1.6vw] text-white/65">{empreendimento.cidade}</span>
            </span>
          </div>
          {/* O mapa daqui é só uma prévia: tocar em qualquer ponto abre a tela de localização. */}
          <button
            type="button"
            onClick={() => setShowMap(true)}
            aria-label="Abrir localização"
            className="absolute inset-0 flex items-end justify-end p-[1.4vw] active:bg-gv-950/10"
          >
            <span className="flex items-center gap-[1vw] rounded-full bg-gv-900 py-[0.7vh] pr-[2.2vw] pl-[1.6vw] text-[1.7vw] font-semibold tracking-[0.15em] text-white uppercase shadow-lg ring-1 ring-white/20">
              <svg viewBox="0 0 24 24" className="h-[2.6vw] w-[2.6vw]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
              Toque para ampliar
            </span>
          </button>
        </div>

        <div className="relative shrink-0 overflow-hidden rounded-[2.4vw] bg-black shadow-[0_2vh_5vh_rgba(0,0,0,0.45)] ring-1 ring-white/15">
          <video
            src={empreendimento.video}
            poster={empreendimento.videoPoster}
            className="aspect-video w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <span className="absolute top-[1.4vh] left-[2vw] flex items-center gap-[1vw] rounded-full bg-gv-950/60 px-[2vw] py-[0.6vh] text-[1.5vw] font-semibold tracking-[0.25em] text-white uppercase backdrop-blur">
            <span className="h-[1.2vw] w-[1.2vw] animate-pulse rounded-full bg-lima" />
            Garden Ville Residence
          </span>
        </div>

        <Link
          to="/cadastro"
          className="mx-auto flex h-[4.6vh] items-center gap-[2vw] rounded-full bg-lima pr-[0.7vh] pl-[3.4vw] text-[2.2vw] font-bold tracking-[0.14em] text-gv-950 uppercase shadow-[0_1.4vh_3vh_rgba(0,0,0,0.35)] transition active:scale-[0.97]"
        >
          Fazer meu cadastro
          <span className="flex h-[3.4vh] w-[3.4vh] items-center justify-center rounded-full bg-gv-950 text-lima">
            <ArrowIcon />
          </span>
        </Link>
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
    <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
