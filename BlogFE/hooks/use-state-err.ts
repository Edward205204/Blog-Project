import { useEffect, useRef, useState } from 'react'

export function useStableError<T extends object>(errors?: Partial<Record<keyof T, string>> | string) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const combined = typeof errors === 'string' ? errors : JSON.stringify(errors)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (ref.current) {
        const nextHeight = ref.current.scrollHeight
        setHeight(nextHeight)
      }
    })
  }, [combined])

  const hasError = typeof errors === 'string' ? Boolean(errors) : !!errors && Object.values(errors).some(Boolean)

  return {
    ref,
    style: {
      height: hasError ? height : 0,
      transition: 'height 0.2s ease, opacity 0.2s ease',
      overflow: 'hidden',
      opacity: hasError ? 1 : 0
    },
    hasError
  }
}
