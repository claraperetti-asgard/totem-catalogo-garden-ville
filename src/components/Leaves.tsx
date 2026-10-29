// Folha amendoada, a mesma forma da estampa da capa da revista.
const FOLHA = 'M0 -30C14 -18 14 18 0 30C-14 18 -14 -18 0 -30Z'

/** Fundo verde-floresta com a estampa de folhas da marca. */
export function LeafBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-gv-900">
      <svg className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
        <defs>
          <pattern id="gv-folhas" width="150" height="130" patternUnits="userSpaceOnUse">
            <path d={FOLHA} transform="translate(30 32) rotate(38)" fill="#0b4123" />
            <path d={FOLHA} transform="translate(68 30) rotate(-14) scale(.8)" fill="#0b4123" />
            <path d={FOLHA} transform="translate(112 36) rotate(30) scale(.9)" fill="#0b4123" />
            <path d={FOLHA} transform="translate(48 96) rotate(-30) scale(.85)" fill="#0b4123" />
            <path d={FOLHA} transform="translate(92 98) rotate(18)" fill="#0b4123" />
            <path d={FOLHA} transform="translate(138 100) rotate(-36) scale(.75)" fill="#0b4123" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gv-folhas)" />
      </svg>
      {/* Luz suave no alto e vinheta nas bordas: dá profundidade sem brigar com o conteúdo. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,rgba(166,198,56,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,22,11,0.75)_100%)]" />
    </div>
  )
}
