import { useEffect, useRef, useState } from 'react'

export interface RouteLoadingBarProps {
  /**
   * 현재 경로. react-router면 `useLocation().pathname`, Next.js면 `usePathname()`을 그대로 넘긴다.
   * 이 컴포넌트는 어떤 라우터를 쓰는지 몰라도 되도록 값만 받는다(라우터 의존성 역전).
   */
  pathname: string
}

/**
 * 페이지(라우트) 전환 시 상단에 표시되는 공용 글로벌 로딩바.
 * 내부 링크 클릭을 감지해 시작하고, 부모가 넘긴 pathname이 실제로 바뀌는 시점에 종료한다.
 */
export function RouteLoadingBar({ pathname }: RouteLoadingBarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement)?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || anchor.target === '_blank') return

      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return

      setIsLoading(true)

      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = setTimeout(() => setIsLoading(false), 4000)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    setIsLoading(false)
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = null
    }
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[200] h-[3px] overflow-hidden">
      <div className="route-loading-bar-fill h-full bg-[var(--ds-background-brand-bold)]" />
    </div>
  )
}
