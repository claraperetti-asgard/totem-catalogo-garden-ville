export default function BotaoFechar({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-[8vw] w-[8vw] shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur transition active:scale-90 active:bg-lima active:text-gv-950"
    >
      <svg viewBox="0 0 24 24" className="h-[3.4vw] w-[3.4vw]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  )
}
