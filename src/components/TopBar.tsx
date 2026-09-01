import type { ReactNode } from 'react'
import { PanelLeft } from 'lucide-react'

export interface TopBarProps {
  logo: ReactNode
  title: ReactNode
  collapsed: boolean
  onToggleCollapsed: () => void
  /** 우측 슬롯(사이트 전환, 아바타 메뉴 등 프로젝트마다 다른 것들을 여기에 끼운다). */
  right?: ReactNode
  /** NavRail의 `collapsedWidth`와 같은 값을 넘겨야 토글 버튼과 접힌 아이콘 레일이 세로로 정렬된다. */
  railWidth?: number
}

/**
 * 전체 폭을 가로지르는 공용 탑 영역. LNB(NavRail) 옆이 아니라 그 위에 놓아야 로고/토글 버튼이
 * LNB 너비 변화와 무관하게 항상 같은 위치(좌상단)에 고정된다.
 */
export function TopBar({ logo, title, collapsed, onToggleCollapsed, right, railWidth = 64 }: TopBarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 bg-[var(--ds-surface)] pr-3">
      <div className="flex shrink-0 items-center justify-center" style={{ width: railWidth }}>
        <button
          type="button"
          onClick={onToggleCollapsed}
          title={collapsed ? '펼치기' : '접기'}
          className="flex h-8 w-8 items-center justify-center rounded text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)]"
        >
          <PanelLeft size={16} strokeWidth={2.25} />
        </button>
      </div>
      <span className="flex h-6 w-6 shrink-0 items-center">{logo}</span>
      <span className="text-sm font-bold tracking-tight text-[var(--ds-text)]">{title}</span>

      {right && <div className="ml-auto flex items-center gap-3">{right}</div>}
    </header>
  )
}
