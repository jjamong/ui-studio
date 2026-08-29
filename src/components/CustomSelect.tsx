import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

export interface CustomSelectOption {
  value: string
  label: string
}

export interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: CustomSelectOption[]
  placeholder?: string
  className?: string
}

/** 팝업 레이어 형태의 커스텀 셀렉트. 검색/필터 바 등 네이티브 select보다 자유로운 스타일이 필요할 때 사용한다. */
export function CustomSelect({ value, onChange, options, placeholder = '선택', className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={clsx('relative w-full', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          'flex h-9 w-full items-center justify-between rounded-md border bg-[var(--ds-surface)] px-3 text-left text-sm text-[var(--ds-text)] outline-none transition-colors',
          isOpen ? 'border-[var(--ds-border-focused)]' : 'border-[var(--ds-border)]',
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={14}
          className={clsx('shrink-0 text-[var(--ds-text-subtle)] transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-md border border-[var(--ds-border)] bg-[var(--ds-surface-overlay)] shadow-[var(--ds-shadow-overlay)]">
          {options.length === 0 ? (
            <p className="px-3 py-2.5 text-center text-xs text-[var(--ds-text-subtle)]">옵션이 없습니다.</p>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={clsx(
                    'block w-full px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-[var(--ds-background-selected)] font-semibold text-[var(--ds-text-selected)]'
                      : 'text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]',
                  )}
                >
                  {option.label}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
