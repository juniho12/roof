'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  rootMargin?: string
  minHeight?: number | string
  className?: string
}

export function LazyMount({ children, rootMargin = '200px', minHeight = 400, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible || !ref.current) return
    const el = ref.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={ref} className={className} style={!visible ? { minHeight } : undefined}>
      {visible ? children : null}
    </div>
  )
}
