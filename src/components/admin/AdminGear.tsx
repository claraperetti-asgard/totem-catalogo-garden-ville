import { useRef, useState } from 'react'
import KeyboardReact from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import { ADMIN_PASSWORD, ADMIN_USER } from '../../config/admin'
import BotaoFechar from '../BotaoFechar'
import { LeafBackground } from '../Leaves'
import SectionTitle from '../SectionTitle'
import TotemHeader from '../TotemHeader'
import Respostas from './Respostas'

// Mesmo ajuste dos outros totens: dependendo do bundle o componente vem em .default.
const Keyboard = (KeyboardReact as any).default || KeyboardReact

type CampoLogin = 'usuario' | 'senha'

/** Engrenagem discreta que abre o login e o painel do administrador com os leads. */
export default function AdminGear({ className = '' }: { className?: string }) {
  const [loginAberto, setLoginAberto] = useState(false)
  const [adminAberto, setAdminAberto] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const [foco, setFoco] = useState<CampoLogin>('usuario')
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [layout, setLayout] = useState('default')
  const tecladoRef = useRef<any>(null)

  const abrirLogin = () => {
    setUsuario('')
    setSenha('')
    setErroLogin('')
    setFoco('usuario')
    setSenhaVisivel(false)
    setLayout('default')
    tecladoRef.current?.setInput('')
    setLoginAberto(true)
  }

  const trocaFoco = (campo: CampoLogin) => {
    setFoco(campo)
    tecladoRef.current?.setInput(campo === 'usuario' ? usuario : senha)
  }

  const digitou = (valor: string) => {
    setErroLogin('')
    if (foco === 'usuario') setUsuario(valor)
    else setSenha(valor)
  }

  const entrar = () => {
    if (usuario.trim().toLowerCase() === ADMIN_USER && senha === ADMIN_PASSWORD) {
      setLoginAberto(false)
      setAdminAberto(true)
      return
    }
    setErroLogin('Usuário ou senha inválidos')
  }

  const campo = (ativo: boolean) =>
    `flex h-[6.4vh] items-center gap-[2vw] rounded-[2vw] px-[2.6vw] transition ${
      ativo ? 'bg-white/[0.12] ring-2 ring-lima' : 'bg-white/[0.05] ring-1 ring-white/15'
    }`

  return (
    <>
      <button
        type="button"
        onClick={abrirLogin}
        aria-label="Painel do administrador"
        className={`flex h-[6vw] w-[6vw] items-center justify-center rounded-full bg-white/5 text-white/60 ring-1 ring-white/15 backdrop-blur active:scale-90 ${className}`}
      >
        <svg viewBox="0 0 24 24" className="h-[3vw] w-[3vw]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      </button>

      {/* ---------- login do administrador ---------- */}
      {loginAberto && (
        <div className="fixed inset-0 z-[60] flex animate-[fade_.25s_ease] items-center justify-center bg-black/70 px-[6vw] backdrop-blur-sm">
          <div className="relative w-full space-y-[2vh] rounded-[3.4vw] bg-gv-900/95 p-[5vw] text-white shadow-2xl ring-1 ring-white/15">
            <div className="absolute top-[2.4vw] right-[2.4vw]">
              <BotaoFechar onClick={() => setLoginAberto(false)} label="Fechar" />
            </div>

            <h2 className="font-display text-[5vw] leading-tight">
              Acesso <span className="text-lima">admin</span>
            </h2>

            <div className={campo(foco === 'usuario')} onClick={() => trocaFoco('usuario')}>
              <span className="text-[1.7vw] font-semibold tracking-[0.2em] text-white/55 uppercase">Usuário</span>
              <input
                value={usuario}
                readOnly
                inputMode="none"
                className="min-w-0 flex-1 bg-transparent text-[3vw] font-semibold outline-none"
              />
            </div>

            <div className={campo(foco === 'senha')} onClick={() => trocaFoco('senha')}>
              <span className="text-[1.7vw] font-semibold tracking-[0.2em] text-white/55 uppercase">Senha</span>
              <input
                type={senhaVisivel ? 'text' : 'password'}
                value={senha}
                readOnly
                inputMode="none"
                className="min-w-0 flex-1 bg-transparent text-[3vw] font-semibold outline-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSenhaVisivel((v) => !v)
                }}
                aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
                className="text-white/60"
              >
                <svg viewBox="0 0 24 24" className="h-[3.2vw] w-[3.2vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {senhaVisivel && <path d="m4 4 16 16" />}
                </svg>
              </button>
            </div>

            <div className="rounded-[2.4vw] bg-gv-950/50 p-[1.4vw] ring-1 ring-white/10">
              <Keyboard
                keyboardRef={(r: unknown) => (tecladoRef.current = r)}
                layoutName={layout}
                onChange={digitou}
                onKeyPress={(tecla: string) => {
                  if (tecla === '{shift}') setLayout((l) => (l === 'default' ? 'shift' : 'default'))
                }}
                disableCaretPositioning
                preventMouseDownDefault
                theme="hg-theme-default totem-kb"
                layout={{
                  default: ['1 2 3 4 5 6 7 8 9 0', 'q w e r t y u i o p', 'a s d f g h j k l ç', '{shift} z x c v b n m @ . {backspace}'],
                  shift: ['1 2 3 4 5 6 7 8 9 0', 'Q W E R T Y U I O P', 'A S D F G H J K L Ç', '{shift} Z X C V B N M @ . {backspace}'],
                }}
                display={{ '{backspace}': '⌫', '{shift}': '⇧' }}
              />
            </div>

            {erroLogin && <p className="text-[2.2vw] font-semibold text-[#ffd37a]">{erroLogin}</p>}

            <button
              type="button"
              onClick={entrar}
              className="h-[6vh] w-full rounded-full bg-lima text-[2.6vw] font-bold tracking-[0.18em] text-gv-950 uppercase transition active:scale-[0.98]"
            >
              Entrar
            </button>
          </div>
        </div>
      )}

      {/* ---------- painel do administrador ---------- */}
      {adminAberto && (
        <div className="fixed inset-0 z-50 flex animate-[fade_.35s_ease] flex-col overflow-hidden text-white">
          <LeafBackground />
          <TotemHeader />
          <div className="absolute top-[2.6vh] right-[5vw] z-20">
            <BotaoFechar onClick={() => setAdminAberto(false)} label="Fechar painel" />
          </div>
          <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-[3vh] px-[6vw] pt-[4vh] pb-[4vh]">
            <SectionTitle eyebrow="Painel do administrador">Cadastros do totem</SectionTitle>
            <Respostas />
          </div>
        </div>
      )}
    </>
  )
}
