import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { empreendimento } from '../data/gardenVille'
import SectionTitle from './SectionTitle'

export default function LocationModal({ onClose }: { onClose: () => void }) {
  const [qr, setQr] = useState('')

  useEffect(() => {
    QRCode.toDataURL(empreendimento.mapsUrl, { margin: 1, width: 400, color: { dark: '#0b3d1c' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex animate-[fade_.35s_ease] flex-col gap-[2.4vh] bg-[#0b3d1c]/95 px-[6vw] py-[4vh] backdrop-blur">
      <div className="flex items-center justify-between">
        <SectionTitle>Localização</SectionTitle>
        <button
          onClick={onClose}
          className="flex h-[7vw] w-[7vw] items-center justify-center rounded-full bg-white text-[3.8vw] font-bold text-[#1c5f17] shadow-lg active:scale-95"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-[4vw] rounded-[1.2vw] bg-white px-[4vw] py-[2.4vh] text-[#0b3d1c] shadow-xl">
        <div className="flex-1">
          <p className="text-[3.4vw] font-bold leading-tight">{empreendimento.endereco}</p>
          <p className="text-[2.4vw] font-medium opacity-70">{empreendimento.cidade}</p>
          <p className="mt-[1vh] text-[2.2vw] font-semibold text-[#2f8a24]">{empreendimento.site}</p>
        </div>
        {qr && (
          <div className="flex flex-col items-center gap-[0.6vh]">
            <img src={qr} alt="QR Code da localização" className="h-[18vw] w-[18vw]" />
            <span className="text-[1.6vw] font-semibold uppercase tracking-wider opacity-70">Abra no celular</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden rounded-[1.2vw] border-[0.5vw] border-white bg-white shadow-2xl">
        <iframe
          title="Mapa Garden Ville"
          src={empreendimento.mapsEmbed}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <img
        src={empreendimento.mapaLocalizacao}
        alt="Localização Garden Ville"
        className="h-[22vh] w-full rounded-[1.2vw] border-[0.5vw] border-white object-cover shadow-2xl"
      />
    </div>
  )
}
