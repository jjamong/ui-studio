import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'

const meta: Meta<typeof Modal> = {
  title: '컴포넌트/Modal',
  component: Modal,
}
export default meta

type Story = StoryObj<typeof Modal>

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="강남 오피스텔"
          footer={
            <>
              <Button variant="danger" onClick={() => setOpen(false)}>
                삭제
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                닫기
              </Button>
            </>
          }
        >
          <p className="text-sm text-[var(--ds-text)]">모달 본문 내용이 여기에 표시됩니다.</p>
        </Modal>
      </>
    )
  },
}
