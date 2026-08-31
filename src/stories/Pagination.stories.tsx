import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '../components/Pagination'
import type { PaginationProps } from '../components/Pagination'

const meta: Meta<typeof Pagination> = {
  title: '컴포넌트/Pagination',
  component: Pagination,
  args: { totalPages: 12, showQuickJumper: false },
}
export default meta

type Story = StoryObj<typeof Pagination>

export const Playground: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(4)
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />
  },
}

export const WithItemsPerPage: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(20)
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    )
  },
}

export const WithQuickJumper: Story = {
  args: { showQuickJumper: true },
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(4)
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />
  },
}
