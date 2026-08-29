import { useId } from 'react'
import { clsx } from 'clsx'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  id?: string
}

/** 공용 토글 스위치. */
export function Switch({ checked, onChange, label, description, disabled = false, id }: SwitchProps) {
  const reactId = useId()
  const switchId = id ?? reactId

  return (
    <div className="flex items-center justify-between gap-3">
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={switchId}
              className={clsx(
                'text-sm font-semibold',
                disabled ? 'text-[var(--ds-text-disabled)]' : 'text-[var(--ds-text)]',
              )}
            >
              {label}
            </label>
          )}
          {description && <span className="text-2xs text-[var(--ds-text-subtle)]">{description}</span>}
        </div>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none',
          checked ? 'bg-[var(--ds-background-brand-bold)]' : 'bg-[var(--ds-background-neutral)]',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        )}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-[var(--ds-surface)] shadow-[var(--ds-shadow-raised)] transition-transform',
            checked ? 'translate-x-4.5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
