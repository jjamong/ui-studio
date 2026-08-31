import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'

const meta: Meta<typeof Card> = {
  title: '컴포넌트/Card',
  component: Card,
}
export default meta

type Story = StoryObj<typeof Card>

export const Playground: Story = {
  render: () => (
    <div className="w-80">
      <Card
        title="강남 오피스텔"
        actions={<Badge variant="success">보유중</Badge>}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm">
              수정
            </Button>
            <Button size="sm">상세보기</Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--ds-text-subtle)]">서울시 강남구 · 매입가 8.2억 · 현재가 9.1억</p>
      </Card>
    </div>
  ),
}

export const MinimalBody: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <p className="text-sm text-[var(--ds-text)]">헤더/footer 없이 본문만 있는 카드.</p>
      </Card>
    </div>
  ),
}
