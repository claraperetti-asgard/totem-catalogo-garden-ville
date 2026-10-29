type SectionTitleProps = {
  children: string
  /** Texto pequeno em verde-limão acima do título (ex.: "01", "Folder"). */
  eyebrow?: string
}

export default function SectionTitle({ children, eyebrow }: SectionTitleProps) {
  return (
    <div className="flex items-end gap-[2.4vw]">
      <div className="flex flex-col">
        {eyebrow && (
          <span className="text-[1.6vw] font-semibold tracking-[0.4em] text-lima uppercase">{eyebrow}</span>
        )}
        <h2 className="font-display text-[4vw] leading-tight text-white">{children}</h2>
      </div>
      <span className="mb-[1.4vw] h-px flex-1 bg-linear-to-r from-white/30 to-transparent" />
    </div>
  )
}
