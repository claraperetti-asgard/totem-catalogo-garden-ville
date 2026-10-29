import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Totem: bloqueia zoom (pinça, Ctrl + roda, Ctrl + / -) e o menu do toque longo,
// que o meta viewport sozinho não segura em todos os navegadores.
const bloquear = (e: Event) => e.preventDefault()
document.addEventListener('gesturestart', bloquear)
document.addEventListener('contextmenu', bloquear)
document.addEventListener('dragstart', bloquear)
document.addEventListener('touchmove', (e) => e.touches.length > 1 && e.preventDefault(), { passive: false })
document.addEventListener('wheel', (e) => e.ctrlKey && e.preventDefault(), { passive: false })
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
