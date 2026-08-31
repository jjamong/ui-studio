import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover } from '../components/Popover'
import { Button } from '../components/Button'

const meta: Meta<typeof Popover> = {
  title: '컴포넌트/Popover',
  component: Popover,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof Popover>

export const Playground: Story = {
  render: () => (
    <div className="flex justify-center py-16">
      <Popover trigger={<Button variant="secondary">필터</Button>}>
        <div className="w-56 p-3">
          <p className="mb-2 text-xs font-semibold text-[var(--ds-text-subtle)]">자산 종류</p>
          <div className="flex flex-col gap-1.5 text-sm text-[var(--ds-text)]">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> 부동산
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> 현금성 자산
            </label>
          </div>
        </div>
      </Popover>
    </div>
  ),
}
