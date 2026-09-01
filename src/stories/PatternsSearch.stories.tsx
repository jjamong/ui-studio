import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { CustomSelect } from '../components/CustomSelect'
import { DateRangePicker } from '../components/DateRangePicker'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

const meta: Meta = {
  title: '패턴/검색',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

const categoryOptions = [
  { value: 'all', label: '전체 종류' },
  { value: 'real-estate', label: '부동산' },
  { value: 'stock', label: '주식' },
  { value: 'cash', label: '현금성 자산' },
]

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'active', label: '보유중' },
  { value: 'closed', label: '정리완료' },
]

/**
 * 버튼형 검색: 필터(셀렉트·기간검색)만 좌측에 나열하고 가장 우측에 검색/초기화 버튼을 둔다.
 * 버튼은 필터·입력 컨트롤과 높이(h-8)를 맞춘 기본 크기를 쓴다 — 작은 버튼을 옆에 두면 입력 컨트롤과
 * 높이가 안 맞아 줄이 어긋나 보인다. 키워드 입력은 없다. 필터를 아무리 바꿔도 검색은 실행되지 않고
 * "검색" 버튼을 눌러야만 실행된다 —
 * 조회 비용이 크거나 여러 조건을 다 맞춘 뒤 한 번에 조회하고 싶은 목록에 쓴다.
 * 배치 자체(레이아웃/검색)와는 별개로, "언제 조회가 실행되는가"라는 행동 규칙이 핵심이다.
 */
export const 버튼검색: Story = {
  render: () => {
    const [category, setCategory] = useState('all')
    const [status, setStatus] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [appliedQuery, setAppliedQuery] = useState('(검색 전)')

    function handleSearch() {
      setAppliedQuery(`종류=${category}, 상태=${status}, 기간=${startDate || '전체'}~${endDate || '전체'}`)
    }

    function handleReset() {
      setCategory('all')
      setStatus('all')
      setStartDate('')
      setEndDate('')
      setAppliedQuery('(검색 전)')
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-36">
              <CustomSelect value={category} onChange={setCategory} options={categoryOptions} />
            </div>
            <div className="w-36">
              <CustomSelect value={status} onChange={setStatus} options={statusOptions} />
            </div>
            <div className="w-56">
              <DateRangePicker
                startValue={startDate}
                endValue={endDate}
                onChange={(s, e) => {
                  setStartDate(s)
                  setEndDate(e)
                }}
                placeholder="기간 선택"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleSearch}>검색</Button>
            <Button variant="secondary" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </div>
        <p className="text-xs text-[var(--ds-text-subtle)]">적용된 조건: {appliedQuery}</p>
      </div>
    )
  },
}

/**
 * 즉시검색: 키워드 입력이 맨 왼쪽에 오고 이어서 셀렉트·기간검색이 나열된다. 버튼이 없고,
 * 셀렉트를 바꾸거나 키워드를 입력하는 즉시 검색이 실행된다(적용된 조건이 매 입력마다 바로 갱신) —
 * 조건이 단순하고 조회 비용이 낮아 매번 버튼을 누르는 게 번거로운 가벼운 목록에 쓴다.
 * 버튼검색과 배치는 거의 같지만, "언제 조회가 실행되는가"가 정반대인 짝이다.
 */
export const 즉시검색: Story = {
  render: () => {
    const [keyword, setKeyword] = useState('')
    const [category, setCategory] = useState('all')
    const [status, setStatus] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const appliedQuery = `키워드="${keyword}", 종류=${category}, 상태=${status}, 기간=${startDate || '전체'}~${endDate || '전체'}`

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-56">
            <Input
              placeholder="키워드 검색..."
              icon={<Search size={14} />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="w-36">
            <CustomSelect value={category} onChange={setCategory} options={categoryOptions} />
          </div>
          <div className="w-36">
            <CustomSelect value={status} onChange={setStatus} options={statusOptions} />
          </div>
          <div className="w-56">
            <DateRangePicker
              startValue={startDate}
              endValue={endDate}
              onChange={(s, e) => {
                setStartDate(s)
                setEndDate(e)
              }}
              placeholder="기간 선택"
            />
          </div>
        </div>
        <p className="text-xs text-[var(--ds-text-subtle)]">적용된 조건(입력 즉시 반영): {appliedQuery}</p>
      </div>
    )
  },
}
