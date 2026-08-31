import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'

interface AssetRow {
  id: string
  name: string
  category: string
  value: number
  status: 'active' | 'sold'
}

const rows: AssetRow[] = [
  { id: '1', name: '강남 오피스텔', category: '부동산', value: 910_000_000, status: 'active' },
  { id: '2', name: '판교 아파트', category: '부동산', value: 1_450_000_000, status: 'active' },
  { id: '3', name: '입출금 통장', category: '현금성 자산', value: 32_000_000, status: 'active' },
  { id: '4', name: '이전 오피스텔', category: '부동산', value: 620_000_000, status: 'sold' },
]

const meta: Meta<typeof Table> = {
  title: '컴포넌트/Table',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

export const Playground: Story = {
  render: () => (
    <Table<AssetRow>
      columns={[
        { key: 'name', header: '자산명', render: (row) => row.name },
        { key: 'category', header: '종류', render: (row) => row.category },
        { key: 'value', header: '평가액', render: (row) => `${row.value.toLocaleString()}원`, align: 'right' },
        {
          key: 'status',
          header: '상태',
          render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>{row.status === 'active' ? '보유중' : '매각완료'}</Badge>,
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
    <Table<AssetRow>
      columns={[
        { key: 'name', header: '자산명', render: (row) => row.name },
        { key: 'category', header: '종류', render: (row) => row.category },
      ]}
      rows={[]}
      getRowId={(row) => row.id}
    />
  ),
}
