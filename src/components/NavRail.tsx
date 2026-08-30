import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface NavRailItem {
  key: string
  label: string
  icon: ReactNode
  /** 있으면 `<a href>`로 렌더링(플레인 이동). onClick과 함께 주면 onClick이 preventDefault 후 처리한다. */
  href?: string
  active?: boolean
  onClick?: () => void
}

export interface NavRailProps {
  items: NavRailItem[]
  collapsed: boolean
  /** 펼침 상태 너비(px). 기본 160 (Tailwind w-40 상당). */
  expandedWidth?: number
  /** 접힘 상태 너비(px). 기본 64 (Tailwind w-16 상당) — TopBar의 토글 버튼 폭과 맞춰야 세로 정렬이 맞는다. */
  collapsedWidth?: number
}

/** collapsed 시에도 DOM에서 사라지지 않고 폭/투명도만 줄어드는 래퍼. 접힘 애니메이션 중 아이콘이 갑자기
 * 튀거나 깜빡이지 않도록, 조건부 언마운트 대신 이 래퍼로 항상 렌더링해둔 채 시각적으로만 숨긴다. */
function CollapsibleLabel({ collapsed, children, maxWidth = 160 }: { collapsed: boolean; children: ReactNode; maxWidth?: number }) {
  return (
    <span
      className={clsx(
        'overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200',
        collapsed ? 'opacity-0' : 'opacity-100',
      )}
      style={{ maxWidth: collapsed ? 0 : maxWidth }}
    >
      {children}
    </span>
  )
}

/**
 * 좌측 공용 네비게이션 아이콘 레일(LNB). 라우터에 종속되지 않는다 — 활성 상태(`active`)와
 * 클릭 동작(`onClick`)은 소비 프로젝트가 자기 라우터(react-router/Next.js 등)로 계산해서 넘긴다.
 * 로고/토글 버튼은 여기 포함되지 않는다(`TopBar` 참고) — 그래야 LNB 너비 변화와 무관하게
 * 항상 같은 위치에 고정된다.
 */
export function NavRail({ items, collapsed, expandedWidth = 160, collapsedWidth = 64 }: NavRailProps) {
  return (
    <aside
      className="flex h-full shrink-0 flex-col bg-[var(--ds-surface-sunken)] transition-[width] duration-200"
      style={{ width: collapsed ? collapsedWidth : expandedWidth }}
    >
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2">
        {items.map((item) => (
          <a
            key={item.key}
            href={item.href}
            title={collapsed ? item.label : undefined}
            onClick={(e) => {
              if (item.onClick) {
                e.preventDefault()
                item.onClick()
              }
            }}
            className={clsx(
              // 아이콘의 좌측 여백을 접힘 여부와 상관없이 고정해, 펼친 상태에서도 이미 접힘 상태의
              // 토글 버튼(TopBar) 위치와 정렬돼 있도록 한다. 그래야 접고 펼 때 아이콘이 좌우로 움직이지
              // 않고 라벨(CollapsibleLabel)의 폭/투명도만 바뀐다.
              'flex h-9 cursor-pointer items-center gap-2.5 rounded pl-4 pr-2.5 text-xs font-semibold transition-colors',
              item.active
                ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)]',
            )}
          >
            <span className="flex shrink-0 items-center">{item.icon}</span>
            <CollapsibleLabel collapsed={collapsed}>{item.label}</CollapsibleLabel>
          </a>
        ))}
      </nav>
    </aside>
  )
}
