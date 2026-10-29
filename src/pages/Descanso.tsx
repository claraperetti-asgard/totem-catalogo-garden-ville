import { useNavigate } from 'react-router-dom'
import { empreendimento } from '../data/gardenVille'

/** Tela de descanso: o vídeo vertical fica rodando até alguém tocar na tela. */
export default function Descanso() {
  const navigate = useNavigate()

  return (
    <main
      // onClick (e não pointerdown): assim o toque termina aqui e não "vaza" para um botão da tela seguinte.
      onClick={() => navigate('/inicio')}
      className="relative h-screen w-screen overflow-hidden bg-gv-950 font-sans select-none"
    >
      <video
        src={empreendimento.videoDescanso}
        poster={empreendimento.videoDescansoPoster}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    </main>
  )
}
