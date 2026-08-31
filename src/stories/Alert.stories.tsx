import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from '../components/Alert'

const meta: Meta<typeof Alert> = {
  title: '컴포넌트/Alert',
  component: Alert,
  args: {
    type: 'info',
    title: '안내',
    children: '이 계정은 읽기 전용 권한입니다.',
  },
  argTypes: {
    type: { control: 'select', options: ['success', 'error', 'info'] },
  },
}
export default meta

type Story = StoryObj<typeof Alert>

export const Playground: Story = {}

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert type="success" title="저장 완료">변경 사항이 저장되었습니다.</Alert>
      <Alert type="error" title="오류">필수 항목을 입력해주세요.</Alert>
      <Alert type="info" title="안내">이 계정은 읽기 전용 권한입니다.</Alert>
    </div>
  ),
}

export const Dismissible: Story = {
  args: { onClose: () => {} },
}
