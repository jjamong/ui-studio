import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { CustomSelect } from '../components/CustomSelect'
import { DateRangePicker } from '../components/DateRangePicker'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

const meta: Meta = {
  title: '레이아웃/검색',
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
 * 셀렉트 필터 여러 개 + 기간검색(DateRangePicker) + 키워드 검색이 한 줄에 섞였을 때의 배치 참고.
 * 필터류(셀렉트·기간검색)는 좌측, 키워드 입력과 조회/초기화 버튼은 우측 — 세로로 쌓이지 않고
 * 항상 한 줄로 가로 나열되며(공간이 부족할 때만 줄바꿈), SearchActionBar와 같은 좌우 분리 원칙을
 * 따른다. SearchActionBar의 filters는 CustomSelect 기반으로 고정돼 있어 기간검색 같은 다른 종류의
 * 입력은 끼워 넣을 수 없어서, 이 조합은 컴포넌트를 직접 배치해서 보여준다.
 *
 * 이건 순수 배치(레이아웃) 참고용이다 — 버튼을 눌러야 검색되는지 즉시 검색되는지 같은 동작/행동
 * 차이는 여기서 다루지 않는다(그건 패턴/검색을 본다).
 */
export const 검색: Story = {
  render: () => {
    const [category, setCategory] = useState('all')
    const [status, setStatus] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [keyword, setKeyword] = useState('')

    function handleReset() {
      setCategory('all')
      setStatus('all')
      setStartDate('')
      setEndDate('')
      setKeyword('')
    }

    return (
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

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-56">
            <Input
              placeholder="키워드 검색..."
              icon={<Search size={14} />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button>조회</Button>
          <Button variant="secondary" onClick={handleReset}>
            초기화
          </Button>
        </div>
      </div>
    )
  },
}

/**
 * 버튼검색 배치: 필터(셀렉트·기간검색)만 좌측, 검색/초기화 버튼이 가장 우측. 키워드 입력이 없다.
 * 순수 배치 참고용이라 실제로 검색이 실행되는지는 다루지 않는다(그 행동은 패턴/검색의 버튼검색을 본다).
 */
export const 버튼검색: Story = {
  render: () => {
    const [category, setCategory] = useState('all')
    const [status, setStatus] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    return (
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
          <Button>검색</Button>
          <Button variant="secondary">초기화</Button>
        </div>
      </div>
    )
  },
}

/**
 * 즉시검색 배치: 키워드 입력이 맨 왼쪽, 이어서 셀렉트·기간검색이 나열되고 버튼은 없다.
 * 순수 배치 참고용이라 실제로 즉시 검색이 실행되는지는 다루지 않는다(그 행동은 패턴/검색의 즉시검색을 본다).
 */
export const 즉시검색: Story = {
  render: () => {
    const [keyword, setKeyword] = useState('')
    const [category, setCategory] = useState('all')
    const [status, setStatus] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    return (
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
    )
  },
}
