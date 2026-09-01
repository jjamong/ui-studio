import { useRef, useState } from 'react'
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
  useListNavigation,
  useRole,
} from '@floating-ui/react'
import { clsx } from 'clsx'

export interface DropdownMenuItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  onSelect: () => void
}

export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  placement?: DropdownMenuPlacement
}

/** 클릭으로 여는 공용 드롭다운 메뉴. 방향키로 항목을 이동하고 Enter로 선택할 수 있다. */
export function DropdownMenu({ trigger, items, placement = 'bottom-start' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const listRef = useRef<(HTMLElement | null)[]>([])

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([click, dismiss, role, listNavigation])

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {trigger}
      </span>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[var(--ds-z-dropdown)] min-w-[160px] overflow-hidden rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] shadow-[var(--ds-shadow-overlay)]"
            >
              {items.map((item, index) => (
                <button
                  key={item.key}
                  ref={(node) => {
                    listRef.current[index] = node
                  }}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  tabIndex={activeIndex === index ? 0 : -1}
                  {...getItemProps({
                    onClick: () => {
                      item.onSelect()
                      setOpen(false)
                    },
                  })}
                  className={clsx(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                    item.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : item.danger
                        ? 'text-[var(--ds-text-danger)] hover:bg-[var(--ds-background-danger-hovered)]'
                        : 'text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]',
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}
