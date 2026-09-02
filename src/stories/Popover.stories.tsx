import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover } from '../components/Popover'
import { Button } from '../components/Button'
import { Checkbox } from '../components/Checkbox'

const meta: Meta<typeof Popover> = {
  title: '컴포넌트/Popover',
  component: Popover,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof Popover>

export const Playground: Story = {
  render: () => {
    const [notice, setNotice] = useState(true)
    const [event, setEvent] = useState(false)

    return (
      <div className="flex justify-center py-16">
        <Popover trigger={<Button variant="secondary">필터</Button>}>
          <div className="w-56 p-3">
            <p className="mb-2 text-xs font-semibold text-[var(--ds-text-subtle)]">분류</p>
            <div className="flex flex-col gap-1.5">
              <Checkbox checked={notice} onChange={setNotice} label="공지" />
              <Checkbox checked={event} onChange={setEvent} label="이벤트" />
            </div>
          </div>
        </Popover>
      </div>
    )
  },
}
