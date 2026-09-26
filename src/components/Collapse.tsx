import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface CollapseProps {
  open: boolean
  children: ReactNode
  className?: string
}

/**
 * 열고 닫을 때 높이/투명도가 부드럽게 바뀌는 공용 접이식 래퍼. 내용 높이를 측정하지 않고
 * `grid-template-rows: 0fr ↔ 1fr` 트랜지션으로 실제 높이까지 애니메이션한다.
 * 닫힌 동안에도 DOM에는 남아 있지만 `inert`로 포커스/클릭을 막는다.
 * 여백(padding)은 `className`으로 넘겨야 닫힐 때 같이 접힌다.
 */
export function Collapse({ open, children, className }: CollapseProps) {
  return (
    <div
      inert={!open}
      className={clsx(
        'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className={className}>{children}</div>
      </div>
    </div>
  )
}
