import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingSpinner } from '../components/LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: '컴포넌트/LoadingSpinner',
  component: LoadingSpinner,
}
export default meta

type Story = StoryObj<typeof LoadingSpinner>

export const Playground: Story = {}

export const CustomMessage: Story = {
  args: { message: '목록을 불러오는 중...' },
}
