import { Search } from 'lucide-react'
import { CustomSelect } from '../components/CustomSelect'
import { DateRangePicker } from '../components/DateRangePicker'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export interface SearchFilterOption {
  value: string
  label: string
}

export interface InstantSearchBarProps {
  keyword: string
  onKeywordChange: (value: string) => void
  keywordPlaceholder?: string
  category?: string
  onCategoryChange?: (value: string) => void
  categoryOptions?: SearchFilterOption[]
  status?: string
  onStatusChange?: (value: string) => void
  statusOptions?: SearchFilterOption[]
  startDate?: string
  endDate?: string
  onDateChange?: (start: string, end: string) => void
}

/**
 * 패턴/검색의 "즉시검색" 배치. 키워드/필터를 바꾸는 즉시 검색이 실행되는 목록에 쓴다.
 * 필요한 필터만 props로 넘기면 되고(카테고리/상태/기간은 각각 독립적으로 선택 사용), 나머지는
 * 렌더링되지 않는다 — 목록마다 실제로 필터링할 수 있는 항목만 골라 쓰기 위해서다.
 */
export function InstantSearchBar({
  keyword,
  onKeywordChange,
  keywordPlaceholder = '키워드 검색...',
  category,
  onCategoryChange,
  categoryOptions,
  status,
  onStatusChange,
  statusOptions,
  startDate,
  endDate,
  onDateChange,
}: InstantSearchBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-56">
        <Input
          placeholder={keywordPlaceholder}
          icon={<Search size={14} />}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>
      {categoryOptions && onCategoryChange && (
        <div className="w-36">
          <CustomSelect value={category ?? ''} onChange={onCategoryChange} options={categoryOptions} />
        </div>
      )}
      {statusOptions && onStatusChange && (
        <div className="w-36">
          <CustomSelect value={status ?? ''} onChange={onStatusChange} options={statusOptions} />
        </div>
      )}
      {onDateChange && (
        <div className="w-56">
          <DateRangePicker startValue={startDate ?? ''} endValue={endDate ?? ''} onChange={onDateChange} placeholder="기간 선택" />
        </div>
      )}
    </div>
  )
}

export interface ButtonSearchBarProps {
  category?: string
  onCategoryChange?: (value: string) => void
  categoryOptions?: SearchFilterOption[]
  status?: string
  onStatusChange?: (value: string) => void
  statusOptions?: SearchFilterOption[]
  startDate?: string
  endDate?: string
  onDateChange?: (start: string, end: string) => void
  onSearch: () => void
  onReset: () => void
}

/**
 * 패턴/검색의 "버튼검색" 배치. 키워드 입력 없이 필터만 두고, "검색" 버튼을 눌러야 조회가
 * 실행되는 목록에 쓴다. InstantSearchBar와 마찬가지로 카테고리/상태/기간 필터는 필요한 것만
 * props로 넘긴다.
 */
export function ButtonSearchBar({
  category,
  onCategoryChange,
  categoryOptions,
  status,
  onStatusChange,
  statusOptions,
  startDate,
  endDate,
  onDateChange,
  onSearch,
  onReset,
}: ButtonSearchBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {categoryOptions && onCategoryChange && (
          <div className="w-36">
            <CustomSelect value={category ?? ''} onChange={onCategoryChange} options={categoryOptions} />
          </div>
        )}
        {statusOptions && onStatusChange && (
          <div className="w-36">
            <CustomSelect value={status ?? ''} onChange={onStatusChange} options={statusOptions} />
          </div>
        )}
        {onDateChange && (
          <div className="w-56">
            <DateRangePicker startValue={startDate ?? ''} endValue={endDate ?? ''} onChange={onDateChange} placeholder="기간 선택" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onSearch}>검색</Button>
        <Button variant="secondary" onClick={onReset}>
          초기화
        </Button>
      </div>
    </div>
  )
}
