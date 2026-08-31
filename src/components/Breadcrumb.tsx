import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

/** 공용 브레드크럼. 마지막 항목은 현재 위치로 강조 표시되고 링크로 렌더링되지 않는다. */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        const clickable = !isLast && (item.href || item.onClick)

        return (
          <Fragment key={idx}>
            {idx > 0 && <ChevronRight size={13} className="shrink-0 text-[var(--ds-text-subtle)]" />}
            {clickable ? (
              item.href ? (
                <a href={item.href} className="truncate text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)] hover:underline">
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="truncate text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)] hover:underline"
                >
                  {item.label}
                </button>
              )
            ) : (
              <span className={clsx('truncate', isLast ? 'font-semibold text-[var(--ds-text)]' : 'text-[var(--ds-text-subtle)]')}>
                {item.label}
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
