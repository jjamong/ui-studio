import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchActionBar } from '../components/SearchActionBar'

const meta: Meta<typeof SearchActionBar> = {
  title: '컴포넌트/SearchActionBar',
  component: SearchActionBar,
  args: {
    searchPlaceholder: '자산명으로 검색...',
    totalCount: 128,
    filters: [
      {
        key: 'category',
        value: 'all',
        options: [
          { value: 'all', label: '전체' },
          { value: 'real-estate', label: '부동산' },
          { value: 'stock', label: '주식' },
        ],
      },
    ],
    onSearch: (query, filters) => console.log('search', query, filters),
  },
}
export default meta

type Story = StoryObj<typeof SearchActionBar>

export const Playground: Story = {}

export const NoFilters: Story = {
  args: { filters: [] },
}
