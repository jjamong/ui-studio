import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  FloatingPortal,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: TooltipPlacement
}

/**
 * 호버/포커스 시 나타나는 공용 툴팁. children을 그대로 감싸서 트리거로 쓴다(추가 ref 병합
 * 없이 안전하게 동작하도록 <span>으로 감싼다 — inline-flex라 레이아웃에 영향 없음).
 */
export function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  })

  const hover = useHover(context, { move: false })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role])

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[var(--ds-z-dropdown)] rounded bg-[var(--ds-text)] px-2 py-1 text-2xs font-medium text-[var(--ds-text-inverse)] shadow-[var(--ds-shadow-overlay)]"
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
