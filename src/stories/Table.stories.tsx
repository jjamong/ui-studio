import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'

interface NoticeRow {
  id: string
  name: string
  category: string
  views: number
  status: 'active' | 'closed'
}

const rows: NoticeRow[] = [
  { id: '1', name: '시스템 점검 안내', category: '공지', views: 1240, status: 'active' },
  { id: '2', name: '신규 기능 출시', category: '공지', views: 980, status: 'active' },
  { id: '3', name: '커뮤니티 이벤트', category: '이벤트', views: 3200, status: 'active' },
  { id: '4', name: '서비스 종료 안내', category: '공지', views: 512, status: 'closed' },
]

const meta: Meta<typeof Table> = {
  title: '컴포넌트/Table',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

export const Playground: Story = {
  render: () => (
    <Table<NoticeRow>
      columns={[
        { key: 'name', header: '이름', render: (row) => row.name },
        { key: 'category', header: '종류', render: (row) => row.category },
        { key: 'views', header: '조회수', render: (row) => `${row.views.toLocaleString()}회`, align: 'right' },
        {
          key: 'status',
          header: '상태',
          render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>{row.status === 'active' ? '게시중' : '게시종료'}</Badge>,
        },
      ]}
      rows={rows}
      getRowId={(row) => row.id}
      onRowClick={() => {}}
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <Table<NoticeRow>
      columns={[
        { key: 'name', header: '이름', render: (row) => row.name },
        { key: 'category', header: '종류', render: (row) => row.category },
      ]}
      rows={[]}
      getRowId={(row) => row.id}
    />
  ),
}

/**
 * onReorder를 주면 맨 앞에 손잡이 칸이 생기고 행을 끌어 순서를 바꾼다. 손잡이에 포커스한 뒤 ↑/↓ 키로도 옮긴다.
 * 손잡이 클릭은 onRowClick으로 번지지 않으므로 행 클릭(상세 이동)과 같이 써도 된다.
 */
export const 순서변경: Story = {
  render: () => {
    const [items, setItems] = useState(rows)
    return (
      <Table<NoticeRow>
        columns={[
          { key: 'name', header: '이름', render: (row) => row.name },
          { key: 'category', header: '종류', render: (row) => row.category },
          { key: 'views', header: '조회수', render: (row) => `${row.views.toLocaleString()}회`, align: 'right' },
        ]}
        rows={items}
        getRowId={(row) => row.id}
        onRowClick={() => {}}
        onReorder={setItems}
      />
    )
  },
}

/** 저장 중이거나 검색 중처럼 순서 변경을 막은 상태 — 손잡이 칸은 그대로 두고 비활성화한다 */
export const 순서변경비활성: Story = {
  render: () => (
    <Table<NoticeRow>
      columns={[
        { key: 'name', header: '이름', render: (row) => row.name },
        { key: 'category', header: '종류', render: (row) => row.category },
      ]}
      rows={rows}
      getRowId={(row) => row.id}
      onReorder={() => {}}
      reorderDisabled
    />
  ),
}
