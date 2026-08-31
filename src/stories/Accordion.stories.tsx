import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from '../components/Accordion'

const items = [
  { id: 'a', title: '부동산이란?', content: '토지 및 그 정착물을 말합니다.' },
  { id: 'b', title: '현금성 자산이란?', content: '즉시 현금화 가능한 자산입니다.' },
  { id: 'c', title: '비활성 항목', content: '', disabled: true },
]

const meta: Meta<typeof Accordion> = {
  title: '컴포넌트/Accordion',
  component: Accordion,
  args: { items },
}
export default meta

type Story = StoryObj<typeof Accordion>

export const Playground: Story = {
  args: { defaultExpandedIds: ['a'] },
}

export const Multiple: Story = {
  args: { multiple: true, defaultExpandedIds: ['a', 'b'] },
}
