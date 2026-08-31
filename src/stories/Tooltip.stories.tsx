import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from '../components/Tooltip'
import { Button } from '../components/Button'

const meta: Meta<typeof Tooltip> = {
  title: '컴포넌트/Tooltip',
  component: Tooltip,
  parameters: { layout: 'padded' },
  args: { content: '평가액은 전일 종가 기준입니다.' },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Playground: Story = {
  render: (args) => (
    <div className="flex justify-center py-16">
      <Tooltip {...args}>
        <Button variant="secondary">마우스를 올려보세요</Button>
      </Tooltip>
    </div>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="flex justify-center gap-6 py-16">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip key={placement} content={`placement: ${placement}`} placement={placement}>
          <Button variant="secondary" size="sm">
            {placement}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
}
