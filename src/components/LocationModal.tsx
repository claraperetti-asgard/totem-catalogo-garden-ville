import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { empreendimento } from '../data/gardenVille'
import BotaoFechar from './BotaoFechar'
import MapaInterativo from './MapaInterativo'
import SectionTitle from './SectionTitle'

export default function LocationModal({ onClose }: { onClose: () => void }) {
  const [qr, setQr] = useState('')

  useEffect(() => {
    QRCode.toDataURL(empreendimento.mapsUrl, { margin: 1, width: 400, color: { dark: '#052b16' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex animate-[fade_.35s_ease] flex-col gap-[2.4vh] bg-gv-950/95 px-[6vw] py-[4vh] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 pr-[4vw]">
          <SectionTitle eyebrow="Como chegar">Localização</SectionTitle>
        </div>
        <BotaoFechar onClick={onClose} label="Fechar" />
      </div>

      <div className="flex items-center gap-[4vw] rounded-[2.4vw] bg-white/[0.06] px-[4vw] py-[2.4vh] text-white ring-1 ring-white/15">
        <div className="flex-1">
          <p className="font-display text-[3.8vw] leading-tight">{empreendimento.endereco}</p>
          <p className="mt-[0.4vh] text-[2.4vw] font-medium text-white/60">{empreendimento.cidade}</p>
          <p className="mt-[1.4vh] text-[2.2vw] font-semibold tracking-wide text-lima">{empreendimento.site}</p>
        </div>
        {qr && (
          <div className="flex flex-col items-center gap-[1vh]">
            <img src={qr} alt="QR Code da localização" className="h-[18vw] w-[18vw] rounded-[1.6vw] bg-white p-[1vw]" />
            <span className="text-[1.5vw] font-semibold tracking-[0.25em] text-white/60 uppercase">Abra no celular</span>
          </div>
        )}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-[2.4vw] shadow-2xl ring-1 ring-white/15">
        <MapaInterativo />
      </div>

      <img
        src={empreendimento.mapaLocalizacao}
        alt="Localização Garden Ville"
        className="h-[22vh] w-full rounded-[2.4vw] object-cover shadow-2xl ring-1 ring-white/15"
      />
    </div>
  )
}
