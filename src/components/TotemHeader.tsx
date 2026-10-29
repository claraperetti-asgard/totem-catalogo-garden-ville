import { Link } from 'react-router-dom'
import { empreendimento } from '../data/gardenVille'
import { Leaf } from './Leaves'

export default function TotemHeader() {
  return (
    <header className="relative z-10 flex h-[11vh] shrink-0 items-center justify-center gap-[5vw] overflow-hidden bg-white px-[6vw] shadow-lg">
      <Leaf className="absolute -left-[3vw] -top-[4vh] w-[10vw] rotate-[120deg] opacity-25" color="#7cc94f" />
      <Leaf className="absolute -right-[3vw] -top-[4vh] w-[10vw] -rotate-[120deg] opacity-25" color="#7cc94f" />
      <Link to="/" className="h-[8vh]">
        <img src={empreendimento.logo} alt="Garden Ville Residence" className="h-full w-auto object-contain" />
      </Link>
      <span className="h-[5vh] w-px bg-emerald-900/20" />
      <img src={empreendimento.logoConstrutora} alt="Protenge" className="h-[2.6vh] w-auto object-contain" />
    </header>
  )
}
