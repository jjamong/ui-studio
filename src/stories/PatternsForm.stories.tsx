import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'

const meta: Meta = {
  title: '패턴/폼',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

/**
 * 인풋 우측에 조회 버튼을 붙인 배치: 값을 입력하고 버튼을 눌러야 조회가 실행된다
 * (RealEstateDetailPage의 "주소 입력 후 부동산유형 조회" 흐름과 같은 골격).
 * 라벨이 있는 Input과 라벨이 없는 Button의 바닥선을 맞추려면 items-start가 아니라 items-end로 감싼다.
 */
export const 인풋버튼: Story = {
  render: () => {
    const [businessNumber, setBusinessNumber] = useState('')
    const [companyName, setCompanyName] = useState<string | null>(null)
    const [looking, setLooking] = useState(false)

    function handleLookup() {
      if (!businessNumber.trim()) return
      setLooking(true)
      setCompanyName(null)
      setTimeout(() => {
        setCompanyName(`(주)예시상사 (${businessNumber})`)
        setLooking(false)
      }, 600)
    }

    return (
      <div className="flex w-96 flex-col gap-2">
        <div className="flex items-end gap-2">
          <Input
            label="사업자등록번호"
            placeholder="000-00-00000"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
          />
          <Button variant="secondary" onClick={handleLookup} loading={looking}>
            조회
          </Button>
        </div>
        {companyName && <p className="text-xs text-[var(--ds-text-subtle)]">상호명: {companyName}</p>}
      </div>
    )
  },
}

const MOCK_ADDRESSES = [
  '서울특별시 강남구 테헤란로 123',
  '경기도 성남시 분당구 판교역로 456',
  '서울특별시 마포구 월드컵북로 789',
]

/**
 * 주소검색 + 상세주소: 주소 인풋 우측 "주소 검색" 버튼을 누르면 검색 모달이 뜨고, 목록에서
 * 고르면 주소 인풋이 채워지며 모달이 닫힌다. 상세주소(동/호수 등)는 검색 대상이 아니라서
 * 별도 인풋으로 그 아래에 둔다 — 주소가 바뀌어도 상세주소는 사용자가 입력한 값을 그대로 유지한다.
 */
export const 주소: Story = {
  render: () => {
    const [address, setAddress] = useState('')
    const [detailAddress, setDetailAddress] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)

    function handleSelectAddress(selected: string) {
      setAddress(selected)
      setSearchOpen(false)
    }

    return (
      <div className="flex w-96 flex-col gap-4">
        <div className="flex items-end gap-2">
          <Input label="주소" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Button variant="secondary" onClick={() => setSearchOpen(true)}>
            주소 검색
          </Button>
        </div>
        <Input
          label="상세주소"
          placeholder="예: 306동 101호"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />

        <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="주소 검색">
          <ul className="flex flex-col gap-1">
            {MOCK_ADDRESSES.map((addr) => (
              <li key={addr}>
                <button
                  type="button"
                  onClick={() => handleSelectAddress(addr)}
                  className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-hovered)]"
                >
                  {addr}
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      </div>
    )
  },
}
