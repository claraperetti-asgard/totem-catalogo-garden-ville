import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminGear from '../components/admin/AdminGear'
import { LeafBackground } from '../components/Leaves'
import Obrigado from '../components/Obrigado'
import TecladoVirtual, { type TipoTeclado } from '../components/TecladoVirtual'
import TotemHeader from '../components/TotemHeader'
import { useIdleRedirect } from '../hooks/useIdleRedirect'
import { formatCelular, saveLead } from '../lib/leads'

const IDLE_MS = 120_000
/** Depois do cadastro, o totem volta sozinho para a tela de descanso. */
const TEMPO_OBRIGADO = 12_000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Campo = 'nome' | 'celular' | 'email'

const TECLADO: Record<Campo, TipoTeclado> = { nome: 'texto', celular: 'numerico', email: 'email' }
const ORDEM: Campo[] = ['nome', 'celular', 'email']

const CAMPOS: Record<Campo, { label: string; placeholder: string; icone: ReactNode }> = {
  nome: {
    label: 'Nome completo',
    placeholder: 'Como podemos te chamar?',
    icone: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  },
  celular: {
    label: 'Celular / WhatsApp',
    placeholder: '(43) 99999-9999',
    icone: (
      <>
        <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
        <path d="M11 18.5h2" />
      </>
    ),
  },
  email: {
    label: 'E-mail',
    placeholder: 'seu@email.com',
    icone: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
}

function valido(c: Campo, v: string) {
  if (c === 'nome') return v.trim().length >= 3
  if (c === 'celular') return v.replace(/\D/g, '').length >= 10
  return EMAIL_RE.test(v.trim())
}

export default function Cadastro() {
  const navigate = useNavigate()
  const [valores, setValores] = useState<Record<Campo, string>>({ nome: '', celular: '', email: '' })
  // Campo que o teclado está preenchendo (o teclado fica sempre visível, como nos outros totens).
  const [campo, setCampo] = useState<Campo>('nome')
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const keyboardRef = useRef<any>(null)

  useIdleRedirect(enviado ? TEMPO_OBRIGADO : IDLE_MS)

  const textoInicial = useRef('')

  // Ao trocar de campo o teclado recebe o texto "cru" dele (no celular, só os dígitos).
  useEffect(() => {
    keyboardRef.current?.setInput(textoInicial.current)
  }, [campo])

  function focar(c: Campo) {
    textoInicial.current = c === 'celular' ? valores[c].replace(/\D/g, '') : valores[c]
    setCampo(c)
  }

  function atualizar(c: Campo, raw: string) {
    setErro('')
    if (c === 'celular') {
      const digitos = raw.replace(/\D/g, '').slice(0, 11)
      keyboardRef.current?.setInput(digitos)
      setValores((v) => ({ ...v, celular: formatCelular(digitos) }))
    } else {
      setValores((v) => ({ ...v, [c]: c === 'email' ? raw.replace(/\s/g, '') : raw }))
    }
  }

  async function enviar(e?: FormEvent) {
    e?.preventDefault()
    if (enviando) return
    const { nome, celular, email } = valores
    if (!valido('nome', nome)) return falhar('nome', 'Informe seu nome completo.')
    if (!valido('celular', celular)) return falhar('celular', 'Informe um celular válido com DDD.')
    if (!valido('email', email)) return falhar('email', 'Informe um e-mail válido.')
    setErro('')
    setEnviando(true)
    const falha = await saveLead({ nome: nome.trim(), celular, email: email.trim().toLowerCase() })
    setEnviando(false)
    if (falha) return setErro(falha)
    setEnviado(true)
  }

  function falhar(c: Campo, msg: string) {
    focar(c)
    setErro(msg)
  }

  const completo = ORDEM.every((c) => valido(c, valores[c]))

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden font-sans select-none">
      <LeafBackground />
      <TotemHeader />
      {/* Engrenagem discreta no canto inferior: login do administrador para ver e exportar os leads. */}
      <AdminGear className="absolute right-[4vw] bottom-[2vh] z-20" />

      {enviado ? (
        <Obrigado
          nome={valores.nome}
          celular={valores.celular}
          email={valores.email.trim().toLowerCase()}
          segundos={TEMPO_OBRIGADO / 1000}
          onVoltar={() => navigate('/inicio')}
        />
      ) : (
        <form onSubmit={enviar} noValidate className="relative z-10 flex min-h-0 flex-1 flex-col px-[8vw] pt-[2.4vh]">
          <div className="relative flex items-center justify-center">
            <Link
              to="/inicio"
              aria-label="Voltar"
              className="absolute left-0 flex h-[8vw] w-[8vw] items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur active:scale-90 active:bg-lima active:text-gv-950"
            >
              <svg viewBox="0 0 24 24" className="h-[3.4vw] w-[3.4vw]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5 8 12l7 7" />
              </svg>
            </Link>
            <div className="text-center">
              <span className="text-[1.7vw] font-semibold tracking-[0.4em] text-lima uppercase">Seja o primeiro a saber</span>
              <h1 className="font-display text-[5.6vw] leading-tight text-white">Faça seu cadastro</h1>
            </div>
          </div>

          <div className="mt-[2.4vh] rounded-[3.4vw] bg-gv-950/45 p-[3.6vw] shadow-[0_2vh_6vh_rgba(0,0,0,0.35)] ring-1 ring-white/12 backdrop-blur-md">
            <div className="flex flex-col gap-[1.4vh]">
              {ORDEM.map((c) => (
                <Field
                  key={c}
                  {...CAMPOS[c]}
                  value={valores[c]}
                  ativo={campo === c}
                  ok={valido(c, valores[c])}
                  erro={campo === c && erro !== ''}
                  onFocus={() => focar(c)}
                  onChange={(v) => atualizar(c, v)}
                />
              ))}
            </div>

            {/* Teclado logo abaixo dos campos, no meio da tela (padrão dos totens de cadastro). */}
            <div className="mt-[2vh]">
              <TecladoVirtual tipo={TECLADO[campo]} keyboardRef={keyboardRef} onChange={(v) => atualizar(campo, v)} />
            </div>

            <p className="flex h-[3.4vh] items-center justify-center gap-[1.2vw] text-center text-[2.2vw] font-semibold text-[#ffd37a]">
              {erro && (
                <>
                  <svg viewBox="0 0 24 24" className="h-[2.8vw] w-[2.8vw]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5.5M12 16.5v.01" />
                  </svg>
                  {erro}
                </>
              )}
            </p>

            <button
              type="submit"
              disabled={enviando}
              className={`flex h-[6.4vh] w-full items-center justify-center gap-[2vw] rounded-full text-[2.6vw] font-bold tracking-[0.18em] uppercase transition active:scale-[0.98] ${
                completo
                  ? 'bg-lima text-gv-950 shadow-[0_1.4vh_4vh_rgba(166,198,56,0.35)]'
                  : 'bg-white/10 text-white/70 ring-1 ring-white/15'
              }`}
            >
              {enviando ? 'Salvando...' : 'Finalizar cadastro'}
              <span className="flex h-[3.4vw] w-[3.4vw] items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>

            <p className="mt-[1.4vh] flex items-center justify-center gap-[1vw] text-[1.7vw] text-white/45">
              <svg viewBox="0 0 24 24" className="h-[2.2vw] w-[2.2vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Seus dados são usados apenas para contato sobre o Garden Ville.
            </p>
          </div>
        </form>
      )}
    </main>
  )
}

type FieldProps = {
  label: string
  value: string
  icone: ReactNode
  ativo: boolean
  ok: boolean
  erro: boolean
  onFocus: () => void
  onChange: (value: string) => void
  placeholder?: string
}

function Field({ label, value, icone, ativo, ok, erro, onFocus, onChange, placeholder }: FieldProps) {
  const estado = erro
    ? 'bg-white/[0.1] ring-2 ring-[#ffd37a]'
    : ativo
      ? 'bg-white/[0.12] ring-2 ring-lima shadow-[0_0_4vh_rgba(166,198,56,0.25)]'
      : 'bg-white/[0.05] ring-1 ring-white/15'

  return (
    <label className={`flex h-[7.4vh] items-center gap-[2.4vw] rounded-[2.4vw] px-[2.4vw] transition-all duration-200 ${estado}`}>
      <span
        className={`flex h-[4.8vh] w-[4.8vh] shrink-0 items-center justify-center rounded-full transition ${
          ativo || ok ? 'bg-lima text-gv-950' : 'bg-white/10 text-lima'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icone}
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`text-[1.7vw] font-semibold tracking-[0.25em] uppercase ${ativo ? 'text-lima' : 'text-white/55'}`}>{label}</span>
        <input
          // readOnly + inputMode none: no totem quem digita é o teclado da tela; um campo
          // editável faz o Chrome abrir o teclado do Windows por cima do nosso.
          readOnly
          inputMode="none"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onFocus={onFocus}
          onClick={onFocus}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-[3.2vw] font-semibold text-white caret-lima outline-none placeholder:font-normal placeholder:text-white/30"
        />
      </span>
      {ok && !ativo && (
        <svg viewBox="0 0 24 24" className="h-[3.4vw] w-[3.4vw] shrink-0 text-lima" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5 10 17 19 7.5" />
        </svg>
      )}
    </label>
  )
}
