import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchActionBar } from '../components/SearchActionBar'

const meta: Meta<typeof SearchActionBar> = {
  title: '컴포넌트/SearchActionBar',
  component: SearchActionBar,
  args: {
    searchPlaceholder: '이름으로 검색...',
    totalCount: 128,
    filters: [
      {
        key: 'category',
        value: 'all',
        options: [
          { value: 'all', label: '전체' },
          { value: 'notice', label: '공지' },
          { value: 'event', label: '이벤트' },
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
