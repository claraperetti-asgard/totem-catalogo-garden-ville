import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { PAGE_RATIO, revista } from '../data/gardenVille'

type FlipBookProps = {
  /** Uma página por vez (zoom) em vez da revista aberta. */
  single?: boolean
  /** Folheia sozinha enquanto ninguém mexe. */
  autoplay?: boolean
  autoplayMs?: number
  startPage?: number
  onPageChange?: (page: number) => void
  onReady?: (api: FlipBookApi) => void
}

export type FlipBookApi = {
  prev: () => void
  next: () => void
  goTo: (page: number) => void
}

export const TOTAL_PAGES = revista.length

export default function FlipBook({
  single = false,
  autoplay = false,
  autoplayMs = 5000,
  startPage = 0,
  onPageChange,
  onReady,
}: FlipBookProps) {
  const bookRef = useRef<any>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef(startPage)
  const [size, setSize] = useState<{ w: number; h: number; page: number } | null>(null)

  // O page-flip trabalha com tamanho fixo: medimos o espaço disponível e
  // remontamos o livro quando ele muda.
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => {
      const { width, height } = box.getBoundingClientRect()
      const perPage = single ? width : width / 2
      const w = Math.floor(Math.min(perPage, height * PAGE_RATIO))
      setSize((s) => (s && s.w === w ? s : { w, h: Math.floor(w / PAGE_RATIO), page: pageRef.current }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [single])

  const flip = () => bookRef.current?.pageFlip()

  useEffect(() => {
    onReady?.({
      prev: () => flip()?.flipPrev(),
      next: () => flip()?.flipNext(),
      goTo: (page) => flip()?.flip(page),
    })
  }, [onReady])

  useEffect(() => {
    if (!autoplay) return
    const timer = window.setInterval(() => {
      const book = flip()
      if (!book) return
      const last = TOTAL_PAGES - (single ? 1 : 2)
      if (pageRef.current >= last) book.turnToPage(0)
      else book.flipNext()
    }, autoplayMs)
    return () => window.clearInterval(timer)
  }, [autoplay, autoplayMs, single])

  return (
    <div ref={boxRef} className="flex h-full w-full items-center justify-center">
      {size && size.w > 0 && (
        <HTMLFlipBook
          ref={bookRef}
          key={`${single}-${size.w}`}
          width={size.w}
          height={size.h}
          size="fixed"
          minWidth={100}
          maxWidth={3000}
          minHeight={100}
          maxHeight={3000}
          showCover
          usePortrait={single}
          startPage={size.page}
          drawShadow
          maxShadowOpacity={0.5}
          flippingTime={700}
          mobileScrollSupport={false}
          swipeDistance={10}
          showPageCorners
          clickEventForward
          useMouseEvents
          disableFlipByClick={false}
          autoSize={false}
          startZIndex={0}
          style={{}}
          className="drop-shadow-2xl"
          onFlip={(e: { data: number }) => {
            pageRef.current = Number(e.data)
            onPageChange?.(pageRef.current)
          }}
        >
          {revista.map((src, i) => (
            <div key={src} className="overflow-hidden bg-gv-800">
              <img
                src={src}
                alt={`Página ${i + 1}`}
                draggable={false}
                loading={i < 4 ? 'eager' : 'lazy'}
                className="pointer-events-none h-full w-full object-cover select-none"
              />
            </div>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  )
}
