import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from '../components/Accordion'

const items = [
  { id: 'a', title: '공지사항이란?', content: '서비스 이용자에게 전달하는 안내 메시지를 말합니다.' },
  { id: 'b', title: '사용자란?', content: '서비스에 가입한 계정을 말합니다.' },
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
