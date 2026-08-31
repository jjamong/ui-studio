import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toast } from '../components/Toast'
import type { ToastMessage } from '../components/Toast'
import { Button } from '../components/Button'

const meta: Meta<typeof Toast> = {
  title: '컴포넌트/Toast',
  component: Toast,
}
export default meta

type Story = StoryObj<typeof Toast>

export const Playground: Story = {
  render: () => {
    const [message, setMessage] = useState<ToastMessage | null>({ text: '저장되었습니다.', type: 'success' })
    return (
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setMessage({ text: '저장되었습니다.', type: 'success' })}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => setMessage({ text: '저장에 실패했습니다.', type: 'error' })}>
          Error
        </Button>
        <Button variant="secondary" onClick={() => setMessage({ text: '변경 사항이 없습니다.', type: 'info' })}>
          Info
        </Button>
        <Toast statusMessage={message} setStatusMessage={setMessage} />
      </div>
    )
  },
}
