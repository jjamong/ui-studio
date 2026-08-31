import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox } from 'lucide-react'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { TextArea } from '../components/TextArea'
import { Button } from '../components/Button'
import { Alert } from '../components/Alert'
import { SearchActionBar } from '../components/SearchActionBar'
import { EmptyState } from '../components/EmptyState'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { Modal } from '../components/Modal'

const meta: Meta = {
  title: '패턴',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

/**
 * 폼 컴포넌트(Input/Select/TextArea) + 제출 시 검증 실패를 Alert로 요약해서 보여주는 조합.
 * 필드별 에러(각 컴포넌트의 error prop)와 폼 전체 에러(Alert)를 함께 쓰는 패턴이다.
 */
export const 폼검증: Story = {
  render: () => {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const nameError = submitted && !name ? '자산명을 입력해주세요.' : undefined
    const categoryError = submitted && !category ? '종류를 선택해주세요.' : undefined
    const hasError = !!nameError || !!categoryError

    return (
      <div className="flex w-96 flex-col gap-4">
        {submitted && hasError && <Alert type="error" title="입력을 확인해주세요">필수 항목이 비어있습니다.</Alert>}
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
        <Button onClick={() => setSubmitted(true)}>등록</Button>
      </div>
    )
  },
}

interface AssetRow {
  id: string
  name: string
  category: string
}

const allRows: AssetRow[] = [
  { id: '1', name: '강남 오피스텔', category: '부동산' },
  { id: '2', name: '판교 아파트', category: '부동산' },
]

/** 검색 결과가 없을 때 SearchActionBar 아래를 EmptyState로 대체하는 조합. */
export const 빈검색결과: Story = {
  render: () => {
    const [query, setQuery] = useState('')
    const filtered = query ? allRows.filter((r) => r.name.includes(query)) : allRows

    return (
      <div className="flex flex-col gap-4">
        <SearchActionBar
          searchPlaceholder="자산명으로 검색..."
          onSearch={(q) => setQuery(q)}
          totalCount={filtered.length}
        />
        {filtered.length === 0 ? (
          <EmptyState icon={<Inbox size={32} />} title="검색 결과가 없습니다" description={`'${query}'에 해당하는 자산이 없습니다.`} />
        ) : (
          <ul className="flex flex-col gap-1">
            {filtered.map((r) => (
              <li key={r.id} className="rounded border border-[var(--ds-border)] px-3 py-2 text-sm text-[var(--ds-text)]">
                {r.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  },
}

/** Table 행 클릭으로 Modal 상세를 여는 목록-상세 패턴. */
export const 목록상세: Story = {
  render: () => {
    const [selected, setSelected] = useState<AssetRow | null>(null)

    return (
      <>
        <Table<AssetRow>
          columns={[
            { key: 'name', header: '자산명', render: (row) => row.name },
            { key: 'category', header: '종류', render: (row) => <Badge variant="brand">{row.category}</Badge> },
          ]}
          rows={allRows}
          getRowId={(row) => row.id}
          onRowClick={(row) => setSelected(row)}
        />
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
          <p className="text-sm text-[var(--ds-text)]">종류: {selected?.category}</p>
        </Modal>
      </>
    )
  },
}
