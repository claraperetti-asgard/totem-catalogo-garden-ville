import { useEffect, useState, type ReactNode } from 'react'
import { revista } from '../data/gardenVille'

type ObrigadoProps = {
  nome: string
  celular: string
  email: string
  /** Tempo até o totem voltar sozinho para a tela de descanso. */
  segundos: number
  onVoltar: () => void
}

// Foto da piscina do Garden Club (p13 da revista) no topo do cartão.
const FOTO = revista[12]

/** Tela de agradecimento depois do cadastro. */
export default function Obrigado({ nome, celular, email, segundos, onVoltar }: ObrigadoProps) {
  const [restante, setRestante] = useState(segundos)
  const primeiroNome = nome.trim().split(/\s+/)[0]

  useEffect(() => {
    const timer = window.setInterval(() => setRestante((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="relative z-10 flex flex-1 animate-[fade_.5s_ease] flex-col items-center justify-center px-[8vw] pb-[6vh] text-white">
      <div className="w-full overflow-hidden rounded-[3.4vw] bg-gv-950/55 shadow-[0_3vh_8vh_rgba(0,0,0,0.45)] ring-1 ring-white/12 backdrop-blur-md">
        <div className="relative h-[24vh]">
          <img src={FOTO} alt="" className="h-full w-full object-cover object-[center_35%]" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-gv-950/20 to-gv-950" />
          {/* Selo de confirmação metade sobre a foto, metade sobre o cartão. */}
          <div className="absolute -bottom-[6vw] left-1/2 flex h-[12vw] w-[12vw] -translate-x-1/2 items-center justify-center rounded-full bg-lima shadow-[0_0_6vh_rgba(166,198,56,0.55)] ring-[1vw] ring-gv-950">
            <svg viewBox="0 0 24 24" className="h-[6vw] w-[6vw] text-gv-950" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5 10 17 19 7.5" strokeDasharray="40" className="animate-[check_.6s_.4s_ease-out_both]" />
            </svg>
          </div>
        </div>

        <div className="px-[6vw] pt-[9vw] pb-[5vw] text-center">
          <span className="text-[1.7vw] font-semibold tracking-[0.4em] text-lima uppercase">Cadastro realizado</span>
          <h1 className="mt-[1vh] font-display text-[8vw] leading-none">
            Obrigado{primeiroNome ? `, ${primeiroNome}` : ''}!
          </h1>
          <p className="mx-auto mt-[2vh] max-w-[64vw] text-[2.6vw] leading-relaxed text-white/70">
            Um consultor Garden Ville vai entrar em contato para apresentar tudo o que preparamos para você.
          </p>

          <div className="mt-[3vh] flex flex-col gap-[1.2vh] text-left">
            <Contato rotulo="Celular / WhatsApp" valor={celular}>
              <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
              <path d="M11 18.5h2" />
            </Contato>
            <Contato rotulo="E-mail" valor={email}>
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
            </Contato>
          </div>

          <button
            type="button"
            onClick={onVoltar}
            className="mt-[3.4vh] flex h-[6.4vh] w-full items-center justify-center gap-[2vw] rounded-full bg-lima text-[2.6vw] font-bold tracking-[0.18em] text-gv-950 uppercase shadow-[0_1.4vh_4vh_rgba(166,198,56,0.3)] transition active:scale-[0.98]"
          >
            Voltar ao início
            <svg viewBox="0 0 24 24" className="h-[3.2vw] w-[3.2vw]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          {/* Contagem até o totem voltar sozinho para a tela de descanso. */}
          <div className="mt-[2.4vh] flex items-center gap-[2vw]">
            <div className="h-[0.5vh] flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-lima/70" style={{ animation: `esvaziar ${segundos}s linear forwards` }} />
            </div>
            <span className="text-[1.7vw] text-white/50 tabular-nums">A tela reinicia em {restante}s</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Contato({ rotulo, valor, children }: { rotulo: string; valor: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[2.4vw] rounded-[2vw] bg-white/[0.05] px-[2.4vw] py-[1.2vh] ring-1 ring-white/10">
      <span className="flex h-[4.4vh] w-[4.4vh] shrink-0 items-center justify-center rounded-full bg-white/10 text-lima">
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {children}
        </svg>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[1.5vw] font-semibold tracking-[0.25em] text-white/50 uppercase">{rotulo}</span>
        <span className="truncate text-[2.6vw] font-semibold">{valor}</span>
      </span>
    </div>
  )
}
