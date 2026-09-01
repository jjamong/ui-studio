import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { ContentArea } from './ContentArea'

export interface AppShellProps {
  /** 상단 영역 전체(보통 `TopBar` 엘리먼트). 전체 폭을 가로지르며 lnb 위에 놓인다. */
  top: ReactNode
  /** 좌측 네비게이션 영역 전체(보통 `NavRail` 엘리먼트). */
  lnb: ReactNode
  /** 본문. 내부적으로 `ContentArea`로 감싸진다. */
  children: ReactNode
  /** ContentArea에 넘길 클래스(예: 세로 flex 컨테이너가 필요할 때 "flex flex-col"). */
  contentClassName?: string
  className?: string
}

/**
 * top(TopBar) + lnb(NavRail) + container(ContentArea) 3영역을 조합한 페이지 셸.
 * 각 영역은 소비 프로젝트가 자기 라우터/메뉴 데이터로 구성한 엘리먼트를 그대로 넘기면 된다
 * (예: `<AppShell top={<TopBar .../>} lnb={<NavRail .../>}>...</AppShell>`).
 */
export function AppShell({ top, lnb, children, contentClassName, className }: AppShellProps) {
  return (
    <div className={clsx('flex h-screen w-screen flex-col overflow-hidden bg-[var(--ds-surface-sunken)]', className)}>
      {top}
      <div className="flex flex-1 overflow-hidden">
        {lnb}
        <main className="flex-1 overflow-y-auto">
          <ContentArea className={contentClassName}>{children}</ContentArea>
        </main>
      </div>
    </div>
  )
}
