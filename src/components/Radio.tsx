import { useId } from 'react'
import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface RadioOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface RadioProps {
  name: string
  value: string
  checked: boolean
  onChange: () => void
  label?: ReactNode
  disabled?: boolean
}

const dotWrapperClass = 'relative inline-flex h-4 w-4 shrink-0 items-center justify-center'
const dotInputClass =
  'peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] transition-colors checked:border-[var(--ds-background-brand-bold)] disabled:cursor-not-allowed'
const dotIndicatorClass =
  'pointer-events-none absolute h-1.5 w-1.5 scale-0 rounded-full bg-[var(--ds-background-brand-bold)] transition-transform peer-checked:scale-100'

/** 단일 라디오 버튼. 여러 개를 묶어 쓸 땐 RadioGroup을 사용한다. */
export function Radio({ name, value, checked, onChange, label, disabled = false }: RadioProps) {
  return (
    <label
      className={clsx(
        'inline-flex items-center gap-2 text-sm text-[var(--ds-text)]',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
    >
      <span className={dotWrapperClass}>
        <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className={dotInputClass} />
        <span className={dotIndicatorClass} />
      </span>
      {label}
    </label>
  )
}

export interface RadioGroupProps {
  name?: string
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  layout?: 'vertical' | 'horizontal'
  disabled?: boolean
}

/** 공용 라디오 그룹. */
export function RadioGroup({ name, value, onChange, options, layout = 'vertical', disabled = false }: RadioGroupProps) {
  const reactId = useId()
  const groupName = name ?? reactId

  return (
    <div className={clsx('flex gap-3', layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center')}>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={groupName}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          label={option.label}
          disabled={disabled || option.disabled}
        />
      ))}
    </div>
  )
}
