export default function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-center text-[2.6vw] font-bold uppercase tracking-[0.35em] text-white drop-shadow">
      {children}
    </h2>
  )
}
