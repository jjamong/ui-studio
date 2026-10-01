import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { GripVertical } from 'lucide-react'
import { clsx } from 'clsx'

/** SortableList·Table(onReorder)의 드래그 손잡이. dnd-kit의 attributes/listeners를 그대로 펼쳐 받는다. */
export const SortHandle = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function SortHandle(
  { disabled, className, ...rest },
  ref,
) {
  return (
    <button
      type="button"
      ref={ref}
      {...rest}
      disabled={disabled}
      aria-label="순서 변경 (끌어서 이동, 또는 ↑/↓ 키)"
      className={clsx(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--ds-text-subtlest)] transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-grab hover:bg-[var(--ds-background-neutral-hovered)] hover:text-[var(--ds-text-subtle)] active:cursor-grabbing',
        className,
      )}
    >
      <GripVertical size={14} />
    </button>
  )
})
