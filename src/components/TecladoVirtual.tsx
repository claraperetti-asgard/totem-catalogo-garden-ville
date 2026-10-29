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
}

// Layouts dos totens de cadastro; o de e-mail ganha @ e os domínios mais comuns.
const LAYOUTS = {
  default: [
    '1 2 3 4 5 6 7 8 9 0',
    'q w e r t y u i o p á é í',
    'a s d f g h j k l ó ú ç',
    '{shift} z x c v b n m ã {backspace}',
    '. _ - + * {space}',
  ],
  shift: [
    '! # $ % ¨ & * ( ) ?',
    'Q W E R T Y U I O P Á É Í',
    'A S D F G H J K L Ó Ú Ç',
    '{shift} Z X C V B N M Ã {backspace}',
    '. _ - + ? ^ ~ {space}',
  ],
  email: [
    '1 2 3 4 5 6 7 8 9 0',
    'q w e r t y u i o p',
    'a s d f g h j k l @',
    'z x c v b n m . _ - {backspace}',
    '@gmail.com @hotmail.com @outlook.com .com .br',
  ],
  numeric: ['1 2 3', '4 5 6', '7 8 9', '0 {backspace}'],
}

const DISPLAY = {
  '{backspace}': '⌫ Apagar',
  '{shift}': '⇧',
  '{space}': 'Espaço',
}

/** Teclado na tela do totem (react-simple-keyboard, mesmo padrão dos totens de cadastro). */
export default function TecladoVirtual({ tipo, keyboardRef, onChange }: TecladoVirtualProps) {
  const [shift, setShift] = useState(false)

  const layoutName = tipo === 'numerico' ? 'numeric' : tipo === 'email' ? 'email' : shift ? 'shift' : 'default'

  return (
    <div className="rounded-[2.4vw] bg-gv-950/50 p-[1.4vw] ring-1 ring-white/10">
      <Keyboard
        keyboardRef={(r: unknown) => (keyboardRef.current = r)}
        layoutName={layoutName}
        layout={LAYOUTS}
        display={DISPLAY}
        onChange={onChange}
        onKeyPress={(button: string) => {
          if (button === '{shift}') setShift((s) => !s)
        }}
        disableCaretPositioning
        preventMouseDownDefault
        theme={`hg-theme-default totem-kb ${tipo === 'numerico' ? 'totem-kb-numeric' : ''}`}
      />
    </div>
  )
}
