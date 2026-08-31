import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { CustomSelect } from './CustomSelect'
import { Button } from './Button'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  value: string
  options: FilterOption[]
  placeholder?: string
  widthClass?: string
}

export interface SearchActionBarProps {
  searchPlaceholder?: string
  initialSearchQuery?: string
  filters?: FilterConfig[]
  onSearch: (searchQuery: string, filterValues: Record<string, string>) => void
  totalCount?: number
  extraActions?: ReactNode
}

const EMPTY_FILTERS: FilterConfig[] = []

/** 검색어 + 필터 셀렉트 + 조회 버튼을 하나로 묶은 공용 검색/필터 바. 목록형 화면 상단에서 재사용한다. */
export function SearchActionBar({
  searchPlaceholder = '검색어 입력...',
  initialSearchQuery = '',
  filters = EMPTY_FILTERS,
  onSearch,
  totalCount,
  extraActions,
}: SearchActionBarProps) {
  const [tempSearch, setTempSearch] = useState(initialSearchQuery)
  const [tempFilters, setTempFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    const initialFilters: Record<string, string> = {}
    filters.forEach((f) => {
      initialFilters[f.key] = f.value
    })
    setTempFilters(initialFilters)
  }, [filters])

  function handleSubmit() {
    onSearch(tempSearch, tempFilters)
  }

  function handleFilterChange(key: string, value: string) {
    setTempFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-3 rounded border border-[var(--ds-border)] bg-[var(--ds-surface)] p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {filters.map((filter) => (
          <div key={filter.key} className={filter.widthClass ?? 'w-full sm:w-40'}>
            <CustomSelect
              value={tempFilters[filter.key] ?? filter.value}
              onChange={(val) => handleFilterChange(filter.key, val)}
              options={filter.options}
              placeholder={filter.placeholder}
            />
          </div>
        ))}

        <div className="relative flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ds-text-subtle)]" />
            <input
              type="text"
              value={tempSearch}
              placeholder={searchPlaceholder}
              onChange={(e) => setTempSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="h-8 w-full rounded border border-[var(--ds-border)] bg-[var(--ds-surface-sunken)] pl-8 pr-3 text-sm text-[var(--ds-text)] outline-none focus:border-[var(--ds-border-focused)] focus:bg-[var(--ds-surface)]"
            />
          </div>
          <Button onClick={handleSubmit}>조회</Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-end">
        {totalCount !== undefined && (
          <span className="text-xs text-[var(--ds-text-subtle)]">총 {totalCount.toLocaleString()}개</span>
        )}
        {extraActions}
      </div>
    </div>
  )
}
