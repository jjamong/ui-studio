import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

/** 공용 텍스트에어리어. Input/Select와 동일한 보더·포커스 규격을 공유한다. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, disabled, rows = 3, ...props }, ref) => {
    const reactId = useId()
    const textAreaId = id ?? reactId

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={textAreaId} className="text-xs font-semibold text-[var(--ds-text-subtle)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textAreaId}
          disabled={disabled}
          rows={rows}
          className={clsx(
            'w-full resize-none rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface)] p-2.5 text-sm text-[var(--ds-text)] outline-none transition-colors placeholder:text-[var(--ds-text-subtlest)] focus:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:bg-[var(--ds-background-disabled)] disabled:text-[var(--ds-text-disabled)]',
            error && 'border-[var(--ds-border-danger)] focus:border-[var(--ds-border-danger)]',
            className,
          )}
          {...props}
        />
        {error && <p className="text-2xs text-[var(--ds-text-danger)]">{error}</p>}
      </div>
    )
  },
)

TextArea.displayName = 'TextArea'
