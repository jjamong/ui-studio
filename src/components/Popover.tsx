import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  FloatingFocusManager,
  FloatingPortal,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  placement?: PopoverPlacement
  /** 지정하면 제어 컴포넌트로 동작한다. 생략하면 내부 상태로 비제어 동작한다. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/** 클릭으로 여닫는 공용 팝오버. 임의의 컨텐츠를 담을 수 있다(액션 목록이면 DropdownMenu를 대신 쓴다). */
export function Popover({ trigger, children, placement = 'bottom-start', open: controlledOpen, onOpenChange }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {trigger}
      </span>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[var(--ds-z-dropdown)] rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] shadow-[var(--ds-shadow-overlay)]"
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}
