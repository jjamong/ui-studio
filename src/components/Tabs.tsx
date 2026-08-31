import { useId } from 'react'
import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface TabItem {
  key: string
  label: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}

/**
 * 공용 탭 네비게이션. 탭 목록만 그리고 패널 렌더링은 호출부가 activeKey를 보고 직접 담당한다
 * (Tabs가 패널 내용을 몰라도 되게 하려고 — 배치작업JOB 화면의 "실행/태스크" 같은 구성 참고).
 */
export function Tabs({ items, activeKey, onChange }: TabsProps) {
  const reactId = useId()

  return (
    <div role="tablist" className="flex items-center gap-1 border-b border-[var(--ds-border)]">
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <button
            key={item.key}
            id={`${reactId}-tab-${item.key}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => onChange(item.key)}
            className={clsx(
              'relative -mb-px flex h-9 items-center px-3 text-sm font-semibold transition-colors',
              item.disabled
                ? 'cursor-not-allowed text-[var(--ds-text-disabled)]'
                : isActive
                  ? 'text-[var(--ds-text-selected)]'
                  : 'text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)]',
            )}
          >
            {item.label}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--ds-background-brand-bold)]" />}
          </button>
        )
      })}
    </div>
  )
}
