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
