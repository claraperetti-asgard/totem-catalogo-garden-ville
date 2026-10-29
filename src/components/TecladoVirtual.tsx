import { useState, type RefObject } from 'react'
import KeyboardReact from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

// Mesmo ajuste dos outros totens: dependendo do bundle o componente vem em .default.
const Keyboard = (KeyboardReact as any).default || KeyboardReact

export type TipoTeclado = 'texto' | 'numerico' | 'email'

type TecladoVirtualProps = {
  tipo: TipoTeclado
  keyboardRef: RefObject<any>
  onChange: (value: string) => void
  onEnter?: () => void
}

const LAYOUTS = {
  default: [
    '1 2 3 4 5 6 7 8 9 0',
    'q w e r t y u i o p',
    'a s d f g h j k l ç',
    '{shift} z x c v b n m {backspace}',
    'á é í ó ú ã õ â ê ô',
    '{space} {enter}',
  ],
  shift: [
    '1 2 3 4 5 6 7 8 9 0',
    'Q W E R T Y U I O P',
    'A S D F G H J K L Ç',
    '{shift} Z X C V B N M {backspace}',
    'Á É Í Ó Ú Ã Õ Â Ê Ô',
    '{space} {enter}',
  ],
  email: [
    '1 2 3 4 5 6 7 8 9 0',
    'q w e r t y u i o p',
    'a s d f g h j k l @',
    'z x c v b n m . _ - {backspace}',
    '@gmail.com @hotmail.com @outlook.com .com .br',
    '{enter}',
  ],
  numeric: ['1 2 3', '4 5 6', '7 8 9', '{backspace} 0 {enter}'],
}

const DISPLAY = {
  '{backspace}': '⌫ Apagar',
  '{shift}': '⇧',
  '{space}': 'Espaço',
  '{enter}': 'OK ✓',
}

/** Teclado na tela do totem (react-simple-keyboard, mesmo padrão dos totens de cadastro). */
export default function TecladoVirtual({ tipo, keyboardRef, onChange, onEnter }: TecladoVirtualProps) {
  const [shift, setShift] = useState(false)

  const layoutName = tipo === 'numerico' ? 'numeric' : tipo === 'email' ? 'email' : shift ? 'shift' : 'default'

  return (
    <div className="totem-keyboard-painel">
      <Keyboard
        keyboardRef={(r: unknown) => (keyboardRef.current = r)}
        layoutName={layoutName}
        layout={LAYOUTS}
        display={DISPLAY}
        onChange={onChange}
        onKeyPress={(button: string) => {
          if (button === '{shift}') setShift((s) => !s)
          if (button === '{enter}') onEnter?.()
        }}
        disableCaretPositioning
        preventMouseDownDefault
        theme={`hg-theme-default totem-keyboard ${tipo === 'numerico' ? 'totem-keyboard-numeric' : ''}`}
      />
    </div>
  )
}
