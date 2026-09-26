import { useState, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Collapse } from './Collapse'

export interface NavRailItem {
  key: string
  label: string
  icon: ReactNode
  /** 있으면 `<a href>`로 렌더링(플레인 이동). onClick과 함께 주면 onClick이 preventDefault 후 처리한다. */
  href?: string
  active?: boolean
  onClick?: () => void
}

/** 여러 메뉴를 제목 아래로 묶는 섹션. `NavRail`의 `collapsibleSections`를 켜면 제목을 눌러 섹션을
 * 접고 펼 수 있다. LNB 자체가 접힌 상태에서는 제목 대신 구분선만 보이며 하위 아이콘은 항상 노출된다. */
export interface NavRailGroup {
  key: string
  label: string
  items: NavRailItem[]
  /** 섹션 초기 펼침 여부(`collapsibleSections`일 때만 의미가 있다). 기본 true.
   * 하위 항목 중 active가 있으면 항상 펼친 채로 시작한다. */
  defaultOpen?: boolean
}

export type NavRailEntry = NavRailItem | NavRailGroup

export interface NavRailProps {
  items: NavRailEntry[]
  collapsed: boolean
  /** 펼침 상태 너비(px). 기본 160 (Tailwind w-40 상당). */
  expandedWidth?: number
  /** 접힘 상태 너비(px). 기본 64 (Tailwind w-16 상당) — TopBar의 토글 버튼 폭과 맞춰야 세로 정렬이 맞는다. */
  collapsedWidth?: number
  /** 섹션(`NavRailGroup`) 제목을 눌러 섹션을 접고 펼 수 있게 할지. 기본 false — 제목은 단순 라벨이다. */
  collapsibleSections?: boolean
}

function isGroup(entry: NavRailEntry): entry is NavRailGroup {
  return 'items' in entry
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

function NavRailLink({ item, collapsed }: { item: NavRailItem; collapsed: boolean }) {
  return (
    <a
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
        'flex h-8 shrink-0 cursor-pointer items-center gap-2.5 rounded pl-4 pr-2.5 text-sm transition-colors',
        item.active
          ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text)]'
          : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)]',
      )}
    >
      <span className="flex shrink-0 items-center">{item.icon}</span>
      <CollapsibleLabel collapsed={collapsed}>{item.label}</CollapsibleLabel>
    </a>
  )
}

function NavRailSection({ group, collapsed, collapsible }: { group: NavRailGroup; collapsed: boolean; collapsible: boolean }) {
  const [open, setOpen] = useState(() => (group.defaultOpen ?? true) || group.items.some((i) => i.active))
  // 토글이 없는 섹션은 항상 펼쳐져 있고, LNB가 접혀 있으면 섹션 제목을 누를 수 없으므로 하위 아이콘은 항상 보여준다.
  const showItems = !collapsible || open || collapsed
  const toggleable = collapsible && !collapsed

  return (
    <div className="mt-2 flex flex-col first:mt-0">
      {/* 제목 행은 접힘 여부와 무관하게 같은 높이를 유지해, 접고 펼 때 아래 아이콘들이 위아래로 튀지 않게 한다. */}
      <button
        type="button"
        disabled={!toggleable}
        aria-expanded={collapsible ? showItems : undefined}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'relative flex h-6 shrink-0 items-center justify-between rounded pl-4 pr-2 text-xs font-semibold text-[var(--ds-text-subtlest)] transition-colors',
          toggleable && 'cursor-pointer hover:text-[var(--ds-text)]',
        )}
      >
        <CollapsibleLabel collapsed={collapsed}>{group.label}</CollapsibleLabel>
        {collapsible && (
          <span className={clsx('flex shrink-0 items-center transition-opacity duration-200', collapsed ? 'opacity-0' : 'opacity-100')}>
            <ChevronDown size={14} className={clsx('transition-transform duration-200', !open && '-rotate-90')} />
          </span>
        )}
        <span
          aria-hidden
          className={clsx(
            'pointer-events-none absolute inset-x-2 top-1/2 h-px bg-[var(--ds-border)] transition-opacity duration-200',
            collapsed ? 'opacity-100' : 'opacity-0',
          )}
        />
      </button>
      {/* 항목 위 간격(pt-1)을 Collapse 안에 둬야 섹션을 닫을 때 간격까지 같이 접힌다. */}
      <Collapse open={showItems} className="flex flex-col gap-1 pt-1">
        {group.items.map((item) => (
          <NavRailLink key={item.key} item={item} collapsed={collapsed} />
        ))}
      </Collapse>
    </div>
  )
}

/**
 * 좌측 공용 네비게이션 아이콘 레일(LNB). 라우터에 종속되지 않는다 — 활성 상태(`active`)와
 * 클릭 동작(`onClick`)은 소비 프로젝트가 자기 라우터(react-router/Next.js 등)로 계산해서 넘긴다.
 * `items`에 `NavRailGroup`을 섞어 넣으면 제목이 달린 섹션으로 묶인다(`collapsibleSections`로 접이식).
 * 로고/토글 버튼은 여기 포함되지 않는다(`TopBar` 참고) — 그래야 LNB 너비 변화와 무관하게
 * 항상 같은 위치에 고정된다.
 */
export function NavRail({ items, collapsed, expandedWidth = 160, collapsedWidth = 64, collapsibleSections = false }: NavRailProps) {
  return (
    <aside
      className="flex h-full shrink-0 flex-col bg-[var(--ds-surface-sunken)] transition-[width] duration-200"
      style={{ width: collapsed ? collapsedWidth : expandedWidth }}
    >
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2">
        {items.map((entry) =>
          isGroup(entry) ? (
            <NavRailSection key={entry.key} group={entry} collapsed={collapsed} collapsible={collapsibleSections} />
          ) : (
            <NavRailLink key={entry.key} item={entry} collapsed={collapsed} />
          ),
        )}
      </nav>
    </aside>
  )
}
