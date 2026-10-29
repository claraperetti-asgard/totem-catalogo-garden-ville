import { useState, type ReactNode } from 'react'
import { empreendimento } from '../data/gardenVille'

const ZOOM_INICIAL = 16
const ZOOM_MIN = 11
const ZOOM_MAX = 20

/**
 * Google Maps embutido. O embed não tem botões de zoom próprios, então os
 * nossos trocam o nível na URL. `previa`: só a imagem do mapa, sem botões nem
 * toque (na tela inicial, tocar abre a tela de localização).
 */
export default function MapaInterativo({ previa = false }: { previa?: boolean }) {
  const [zoom, setZoom] = useState(ZOOM_INICIAL)

  return (
    <div className="relative h-full w-full bg-[#f2efe9]">
      <iframe
        title="Mapa Garden Ville"
        src={empreendimento.mapsEmbed(zoom)}
        className={`h-full w-full ${previa ? 'pointer-events-none' : ''}`}
        referrerPolicy="no-referrer-when-downgrade"
      />
      {!previa && (
        <div className="absolute right-[2vw] bottom-[2vw] flex flex-col overflow-hidden rounded-[1.8vw] bg-gv-900 shadow-xl ring-1 ring-white/20">
          <MapaButton label="Aproximar" disabled={zoom >= ZOOM_MAX} onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + 1))}>
            <path d="M12 5v14M5 12h14" />
          </MapaButton>
          <span className="h-px bg-white/15" />
          <MapaButton label="Afastar" disabled={zoom <= ZOOM_MIN} onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - 1))}>
            <path d="M5 12h14" />
          </MapaButton>
        </div>
      )}
    </div>
  )
}

type MapaButtonProps = { label: string; disabled: boolean; onClick: () => void; children: ReactNode }

function MapaButton({ label, disabled, onClick, children }: MapaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-[9vw] w-[9vw] items-center justify-center text-white transition active:bg-lima active:text-gv-950 disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="h-[4vw] w-[4vw]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}
