import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LeafBackground } from '../components/Leaves'
import TecladoVirtual, { type TipoTeclado } from '../components/TecladoVirtual'
import TotemHeader from '../components/TotemHeader'
import { useIdleRedirect } from '../hooks/useIdleRedirect'
import { formatCelular, saveLead } from '../lib/leads'

const IDLE_MS = 120_000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Campo = 'nome' | 'celular' | 'email'

const TECLADO: Record<Campo, TipoTeclado> = { nome: 'texto', celular: 'numerico', email: 'email' }
const ORDEM: Campo[] = ['nome', 'celular', 'email']

export default function Cadastro() {
  const navigate = useNavigate()
  const [valores, setValores] = useState<Record<Campo, string>>({ nome: '', celular: '', email: '' })
  // Campo sendo digitado; null = teclado fechado (só abre ao tocar num campo).
  const [campo, setCampo] = useState<Campo | null>(null)
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)
  const keyboardRef = useRef<any>(null)

  useIdleRedirect(enviado ? 8000 : IDLE_MS)

  const textoInicial = useRef('')

  // O teclado só existe enquanto está aberto: ao abrir/trocar de campo ele
  // recebe o texto "cru" do campo (no celular, só os dígitos).
  useEffect(() => {
    if (campo) keyboardRef.current?.setInput(textoInicial.current)
  }, [campo])

  function focar(c: Campo) {
    textoInicial.current = c === 'celular' ? valores[c].replace(/\D/g, '') : valores[c]
    setCampo(c)
  }

  function fecharTeclado() {
    setCampo(null)
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  // Tocar fora dos campos e do teclado fecha o teclado.
  function tocarFora(e: PointerEvent) {
    const alvo = e.target as HTMLElement
    if (!alvo.closest('input, button, a, .totem-keyboard-painel')) fecharTeclado()
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

  function proximoCampo() {
    const i = campo ? ORDEM.indexOf(campo) : -1
    if (i < ORDEM.length - 1) focar(ORDEM[i + 1])
    else fecharTeclado()
  }

  async function enviar(e?: FormEvent) {
    e?.preventDefault()
    const { nome, celular, email } = valores
    if (nome.trim().length < 3) return falhar('nome', 'Informe seu nome completo.')
    if (celular.replace(/\D/g, '').length < 10) return falhar('celular', 'Informe um celular válido com DDD.')
    if (!EMAIL_RE.test(email.trim())) return falhar('email', 'Informe um e-mail válido.')
    setErro('')
    setCampo(null)
    await saveLead({ nome: nome.trim(), celular, email: email.trim().toLowerCase() })
    setEnviado(true)
  }

  function falhar(c: Campo, msg: string) {
    focar(c)
    setErro(msg)
  }

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden font-[Montserrat,sans-serif] select-none">
      <LeafBackground />
      <TotemHeader />

      {enviado ? (
        <div className="relative z-10 flex flex-1 animate-[fade_.5s_ease] flex-col items-center justify-center gap-[3vh] px-[8vw] text-center text-white">
          <div className="flex h-[22vw] w-[22vw] items-center justify-center rounded-full bg-white text-[12vw] text-[#2f8a24] shadow-2xl">
            ✓
          </div>
          <h1 className="text-[6vw] font-bold uppercase tracking-wider">Obrigado!</h1>
          <p className="text-[3.2vw] leading-snug">
            Cadastro realizado com sucesso.
            <br />
            Em breve um consultor Garden Ville entrará em contato.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-[3vh] rounded-full bg-white px-[8vw] py-[2vh] text-[3vw] font-bold uppercase tracking-widest text-[#1c5f17] shadow-xl active:scale-95"
          >
            Voltar ao início
          </button>
        </div>
      ) : (
        <form onSubmit={enviar} onPointerDown={tocarFora} noValidate className="relative z-10 flex min-h-0 flex-1 flex-col px-[10vw] pt-[6vh]">
          <h1 className="mb-[2.6vh] text-center text-[5vw] font-bold uppercase tracking-wider text-white drop-shadow">
            Faça seu cadastro:
          </h1>

          <Field label="Nome" value={valores.nome} ativo={campo === 'nome'} onFocus={() => focar('nome')} onChange={(v) => atualizar('nome', v)} />
          <Field
            label="Cel"
            value={valores.celular}
            ativo={campo === 'celular'}
            onFocus={() => focar('celular')}
            onChange={(v) => atualizar('celular', v)}
            placeholder="(43) 99999-9999"
          />
          <Field
            label="Email"
            value={valores.email}
            ativo={campo === 'email'}
            onFocus={() => focar('email')}
            onChange={(v) => atualizar('email', v)}
          />

          <p className="h-[3vh] text-center text-[2.4vw] font-semibold text-[#fff4a8]">{erro}</p>

          <div className="flex items-center justify-center gap-[3vw]">
            <span className="text-[4vw] font-bold uppercase tracking-wider text-white">Finalizar:</span>
            <TouchIcon />
            <button
              type="submit"
              className="h-[10vw] w-[15vw] rounded-[2.5vw] bg-white shadow-2xl ring-[0.6vw] ring-[#0b3d1c]/40 transition active:scale-90 active:bg-[#d7ec6a]"
              aria-label="Finalizar cadastro"
            />
          </div>

          {campo && (
            <div className="mt-auto -mx-[6vw] animate-[subir_.25s_ease-out] pb-[1.5vh]">
              <TecladoVirtual
                tipo={TECLADO[campo]}
                keyboardRef={keyboardRef}
                onChange={(v) => atualizar(campo, v)}
                onEnter={proximoCampo}
              />
            </div>
          )}
          <Link
            to="/"
            className="absolute top-[2.2vh] left-[4vw] rounded-full bg-[#0b3d1c]/70 px-[3vw] py-[0.8vh] text-[2.4vw] font-semibold uppercase tracking-widest text-white ring-1 ring-white/30 active:scale-95"
          >
            ‹ Voltar
          </Link>
        </form>
      )}
    </main>
  )
}

type FieldProps = {
  label: string
  value: string
  ativo: boolean
  onFocus: () => void
  onChange: (value: string) => void
  placeholder?: string
}

function Field({ label, value, ativo, onFocus, onChange, placeholder }: FieldProps) {
  return (
    <label className="mb-[2vh] flex flex-col items-center">
      <span className="text-[3vw] font-bold uppercase tracking-[0.3em] text-white">{label}:</span>
      <span className="mt-[0.4vh] h-0 w-0 border-x-[2.2vw] border-t-[2.2vw] border-x-transparent border-t-[#0b3d1c]" />
      <input
        // inputMode none: no totem quem digita é o teclado da tela, não o do sistema.
        inputMode="none"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        className={`-mt-[0.4vh] h-[5vh] w-full rounded-[1.8vw] bg-white px-[3vw] text-center text-[3.6vw] font-semibold text-[#0b3d1c] shadow-xl outline-none transition placeholder:text-[#0b3d1c]/30 ${
          ativo ? 'ring-[0.8vw] ring-[#d7ec6a]' : ''
        }`}
      />
    </label>
  )
}

function TouchIcon() {
  return (
    <svg viewBox="0 0 64 48" className="h-[8vw] w-[11vw]" aria-hidden="true">
      <rect x="2" y="6" width="22" height="36" rx="3" fill="#0b3d1c" />
      <path
        d="M14 20h22a4 4 0 0 1 0 8h-6v4a4 4 0 0 1-4 4H14Z"
        fill="#fff"
        stroke="#0b3d1c"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M44 14c4 3 6 6 6 10s-2 7-6 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M52 8c6 4 9 10 9 16s-3 12-9 16" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
