import { useState } from 'react'
import type { ReactNode } from 'react'
import { Grid3x3, MoreHorizontal, MoreVertical, GripHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { Popover } from './Popover'

export interface AppSwitcherItem {
  key: string
  label: ReactNode
  description?: ReactNode
  icon: ReactNode
  /** 아이콘 배지 배경색 클래스. 예: 'bg-[var(--ds-background-accent-blue-bolder)]'. 생략하면 중립색. */
  badgeClassName?: string
  onSelect: () => void
}

export type AppSwitcherIconType = 'dots-3x3' | 'dots' | 'dots-vertical' | 'grip' | 'grid'

export interface AppSwitcherProps {
  items: AppSwitcherItem[]
  /** 팝오버 내부 레이아웃 스타일 ('list': 세로 리스트, 'grid': 구글 와플 3열 타일) */
  variant?: 'list' | 'grid'
  /** 기본 트리거 아이콘 종류 ('dots-3x3': 3x3 동그란 점 9개 [●●●/●●●/●●●], 'dots': 가로 3점 [...], 'dots-vertical': 세로 3점 [⋮], 'grip': 쩜쩜쩜 핸들, 'grid': 격자) */
  iconType?: AppSwitcherIconType
  /** 트리거 커스터마이즈용. 직접 커스텀 ReactNode를 전달할 때 사용합니다. */
  trigger?: ReactNode
  triggerLabel?: string
}

const defaultBadgeClassName = 'bg-[var(--ds-background-accent-gray-bolder)]'

/** 3x3 동그란 점 9개 (가로 3개 x 세로 3개 쩜쩜쩜) 아이콘 */
function Dots3x3Icon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="4.5" cy="4.5" r="2.2" />
      <circle cx="12" cy="4.5" r="2.2" />
      <circle cx="19.5" cy="4.5" r="2.2" />
      <circle cx="4.5" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="19.5" cy="12" r="2.2" />
      <circle cx="4.5" cy="19.5" r="2.2" />
      <circle cx="12" cy="19.5" r="2.2" />
      <circle cx="19.5" cy="19.5" r="2.2" />
    </svg>
  )
}

function renderDefaultIcon(iconType: AppSwitcherIconType) {
  switch (iconType) {
    case 'dots-3x3':
      return <Dots3x3Icon size={18} />
    case 'dots':
      return <MoreHorizontal size={20} strokeWidth={2.25} />
    case 'dots-vertical':
      return <MoreVertical size={20} strokeWidth={2.25} />
    case 'grip':
      return <GripHorizontal size={20} strokeWidth={2.25} />
    case 'grid':
      return <Grid3x3 size={18} strokeWidth={2.25} />
    default:
      return <Dots3x3Icon size={18} />
  }
}

/**
 * 여러 사이트/앱을 전환하는 공용 "앱 스위처".
 * 기본 트리거 아이콘으로 가로 3개 x 세로 3개 총 9개의 동그란 점 아이콘(`dots-3x3`)을 사용합니다.
 */
export function AppSwitcher({
  items,
  variant = 'list',
  iconType = 'dots-3x3',
  trigger,
  triggerLabel = '앱 전환',
}: AppSwitcherProps) {
  const [open, setOpen] = useState(false)


  function handleSelect(item: AppSwitcherItem) {
    item.onSelect()
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger ?? (
          <button
            type="button"
            aria-label={triggerLabel}
            title={triggerLabel}
            className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ds-text-subtle)] transition-colors hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text)]',
              open && 'bg-[var(--ds-background-neutral)] text-[var(--ds-text)]',
            )}
          >
            {renderDefaultIcon(iconType)}
          </button>
        )
      }
    >
      {variant === 'grid' ? (
        /* 구글 와플 3열 타일 그리드 모드 */
        <div className="grid w-72 grid-cols-3 gap-2 p-3">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-center transition-all hover:bg-[var(--ds-background-neutral-hovered)] hover:scale-105 active:scale-95"
            >
              <div
                className={clsx(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[var(--ds-text-inverse)] shadow-sm',
                  item.badgeClassName ?? defaultBadgeClassName,
                )}
              >
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-[var(--ds-text)] line-clamp-1">{item.label}</span>
            </button>
          ))}
        </div>
      ) : (
        /* 기본 세로 리스트 모드 */
        <div className="w-72 overflow-hidden rounded-md">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[var(--ds-background-neutral-hovered)]"
            >
              <div
                className={clsx(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded text-[var(--ds-text-inverse)]',
                  item.badgeClassName ?? defaultBadgeClassName,
                )}
              >
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--ds-text)]">{item.label}</span>
                {item.description && <span className="text-xs text-[var(--ds-text-subtle)]">{item.description}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </Popover>
  )
}

