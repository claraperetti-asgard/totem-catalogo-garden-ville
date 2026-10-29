import { Link } from 'react-router-dom'
import { empreendimento } from '../data/gardenVille'

/** Logo do Garden Ville e da Protenge lado a lado. */
export default function TotemHeader() {
  return (
    <header className="relative z-10 flex shrink-0 items-center justify-center gap-[5vw] pt-[2.6vh]">
      <Link to="/inicio" className="h-[8.5vh]">
        <img src={empreendimento.logo} alt="Garden Ville Residence" className="h-full w-auto object-contain" />
      </Link>
      <span className="h-[6vh] w-px bg-white/25" />
      <div className="flex flex-col items-start gap-[0.8vh]">
        <span className="text-[1.4vw] font-medium tracking-[0.3em] text-white/50 uppercase">Realização</span>
        <img src={empreendimento.logoConstrutora} alt="Protenge" className="h-[2vh] w-auto object-contain" />
      </div>
    </header>
  )
}
