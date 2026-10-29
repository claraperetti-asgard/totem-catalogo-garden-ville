import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const EVENTS = ['pointerdown', 'touchstart', 'keydown'] as const

/** Volta o totem para a tela inicial depois de um tempo sem interação. */
export function useIdleRedirect(timeoutMs: number, to = '/', onIdle?: () => void) {
  const navigate = useNavigate()

  useEffect(() => {
    let timer = window.setTimeout(fire, timeoutMs)

    function fire() {
      onIdle?.()
      navigate(to)
    }

    function reset() {
      window.clearTimeout(timer)
      timer = window.setTimeout(fire, timeoutMs)
    }

    EVENTS.forEach((e) => window.addEventListener(e, reset))
    return () => {
      window.clearTimeout(timer)
      EVENTS.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [timeoutMs, to, onIdle, navigate])
}
