import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  /** 여러 섹션을 동시에 펼칠 수 있는지. 기본은 하나를 펼치면 나머지가 자동으로 접히는 아코디언. */
  multiple?: boolean
  defaultExpandedIds?: string[]
}

/** 공용 아코디언. */
export function Accordion({ items, multiple = false, defaultExpandedIds = [] }: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))

  function toggle(id: string) {
    setExpandedIds((prev) => {
      const isOpen = prev.has(id)
      if (multiple) {
        const next = new Set(prev)
        if (isOpen) next.delete(id)
        else next.add(id)
        return next
      }
      return isOpen ? new Set() : new Set([id])
    })
  }

  return (
    <div className="flex flex-col divide-y divide-[var(--ds-border)] rounded border border-[var(--ds-border)]">
      {items.map((item) => {
        const isOpen = expandedIds.has(item.id)
        return (
          <div key={item.id}>
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className={clsx(
                'flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-[var(--ds-text)] transition-colors',
                item.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[var(--ds-background-neutral-hovered)]',
              )}
            >
              {item.title}
              <ChevronDown
                size={14}
                className={clsx('shrink-0 text-[var(--ds-text-subtle)] transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen && <div className="px-4 pb-3 text-sm text-[var(--ds-text-subtle)]">{item.content}</div>}
          </div>
        )
      })}
    </div>
  )
}
