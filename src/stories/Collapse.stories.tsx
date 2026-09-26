import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapse } from '../components/Collapse'
import { Button } from '../components/Button'

const meta: Meta<typeof Collapse> = {
  title: '컴포넌트/Collapse',
  component: Collapse,
}
export default meta

type Story = StoryObj<typeof Collapse>

/** 버튼으로 열고 닫으면 높이/투명도가 부드럽게 바뀐다. Accordion, NavRail 섹션이 이걸 쓴다. */
export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <div className="flex w-80 flex-col gap-2">
        <Button variant="secondary" onClick={() => setOpen((o) => !o)}>
          {open ? '닫기' : '열기'}
        </Button>
        <Collapse open={open} className="pt-1 text-sm text-[var(--ds-text-subtle)]">
          공지사항은 서비스 이용자에게 전달하는 안내 메시지입니다. 목록에서 제목을 눌러 상세를 확인하고,
          설정에서 노출 기간과 대상을 지정할 수 있습니다.
        </Collapse>
      </div>
    )
  },
}
