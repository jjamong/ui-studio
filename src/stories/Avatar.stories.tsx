import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../components/Avatar'

const meta: Meta<typeof Avatar> = {
  title: '컴포넌트/Avatar',
  component: Avatar,
  args: { name: '홍길동', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof Avatar>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="홍길동" size="sm" />
      <Avatar name="홍길동" size="md" />
      <Avatar name="홍길동" size="lg" />
    </div>
  ),
}

export const ImageFallback: Story = {
  args: { name: '박지민', src: 'https://broken-image-url.example/avatar.jpg' },
}
