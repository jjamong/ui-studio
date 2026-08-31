import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastProvider, useToast } from '../components/ToastProvider'
import { Button } from '../components/Button'

const meta: Meta = {
  title: '컴포넌트/ToastProvider',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '여러 개를 동시에 스택으로 쌓고 duration 후 자동으로 사라지는 토스트 시스템. 단일 statusMessage만 다루는 Toast 컴포넌트보다 실제 앱에 쓰기 편하다 — 앱 최상단을 ToastProvider로 감싸고, 어디서든 useToast().showToast(...)를 호출한다.',
      },
    },
  },
}
export default meta

type Story = StoryObj

function Demo() {
  const { showToast } = useToast()
  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={() => showToast({ text: '저장되었습니다.', type: 'success' })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => showToast({ text: '저장에 실패했습니다.', type: 'error' })}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => showToast({ text: '변경 사항이 없습니다.', type: 'info' })}>
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          showToast({ text: '첫 번째', type: 'info' })
          showToast({ text: '두 번째', type: 'success' })
          showToast({ text: '세 번째', type: 'error' })
        }}
      >
        여러 개 동시에
      </Button>
    </div>
  )
}

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
}
