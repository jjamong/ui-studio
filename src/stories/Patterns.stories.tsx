import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { TextArea } from '../components/TextArea'
import { Button } from '../components/Button'
import { ToastProvider, useToast } from '../components/ToastProvider'

const meta: Meta = {
  title: '패턴',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

/**
 * 폼 컴포넌트(Input/Select/TextArea) + 제출 시 검증 실패를 토스트로 알리는 조합.
 * 필드별 에러(각 컴포넌트의 error prop)는 인풋 아래 남아서 어디가 문제인지 짚어주고,
 * 폼 전체 에러는 Alert처럼 화면에 눌러앉히지 않고 토스트로 잠깐 띄웠다가 자동으로 사라지게 한다.
 */
function 폼검증Demo() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { showToast } = useToast()

  const nameError = submitted && !name ? '자산명을 입력해주세요.' : undefined
  const categoryError = submitted && !category ? '종류를 선택해주세요.' : undefined

  function handleSubmit() {
    setSubmitted(true)
    if (!name || !category) {
      showToast({ text: '필수 항목이 비어있습니다.', type: 'error' })
      return
    }
    showToast({ text: '등록되었습니다.', type: 'success' })
  }

  return (
    <div className="flex w-96 flex-col gap-4">
      <Input label="자산명" value={name} onChange={(e) => setName(e.target.value)} error={nameError} />
      <Select
        label="종류"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={[
          { value: '', label: '선택' },
          { value: 're', label: '부동산' },
          { value: 'cash', label: '현금성 자산' },
        ]}
        error={categoryError}
      />
      <TextArea label="메모" placeholder="선택 입력" />
      <Button onClick={handleSubmit}>등록</Button>
    </div>
  )
}

export const 폼검증: Story = {
  render: () => (
    <ToastProvider>
      <폼검증Demo />
    </ToastProvider>
  ),
}
