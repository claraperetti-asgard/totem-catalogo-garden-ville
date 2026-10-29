type LeafProps = {
  className?: string
  color?: string
}

export function Leaf({ className = '', color = 'currentColor' }: LeafProps) {
  return (
    <svg viewBox="0 0 100 200" className={className} aria-hidden="true">
      <path d="M50 0C88 40 100 110 50 200C0 110 12 40 50 0Z" fill={color} />
      <path d="M50 18V190" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" fill="none" />
      {[50, 80, 110, 140].map((y) => (
        <g key={y} stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none">
          <path d={`M50 ${y}L${78} ${y - 26}`} />
          <path d={`M50 ${y}L${22} ${y - 26}`} />
        </g>
      ))}
    </svg>
  )
}

/** Folhagem decorativa em volta da tela, como no layout aprovado. */
export function LeafBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#4fae35_0%,#2f8a24_55%,#1c5f17_100%)]" />
      <Leaf className="absolute -left-[6vw] top-[10vh] w-[16vw] rotate-[35deg] opacity-60" color="#57b83c" />
      <Leaf className="absolute -left-[4vw] top-[38vh] w-[12vw] rotate-[60deg] opacity-40" color="#7cc94f" />
      <Leaf className="absolute -left-[5vw] bottom-[6vh] w-[18vw] rotate-[20deg] opacity-70" color="#3d9a2b" />
      <Leaf className="absolute -right-[6vw] top-[16vh] w-[15vw] -rotate-[30deg] opacity-50" color="#6cc046" />
      <Leaf className="absolute -right-[5vw] top-[52vh] w-[13vw] -rotate-[55deg] opacity-40" color="#57b83c" />
      <Leaf className="absolute -right-[4vw] bottom-[4vh] w-[19vw] -rotate-[15deg] opacity-70" color="#3d9a2b" />
      <Leaf className="absolute bottom-[-6vh] left-[30vw] w-[12vw] rotate-[80deg] opacity-30" color="#7cc94f" />
    </div>
  )
}
