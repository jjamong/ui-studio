import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrendText } from '../components/TrendText'

const meta: Meta<typeof TrendText> = {
  title: '컴포넌트/TrendText',
  component: TrendText,
  args: { direction: 'up', value: '+2.4%' },
  argTypes: {
    direction: { control: 'select', options: ['up', 'down', 'flat'] },
  },
}
export default meta

type Story = StoryObj<typeof TrendText>

export const Playground: Story = {}

/** 상승은 성공색, 하락은 위험색, 보합은 중립색이 기본이다. TrendBadge와 같은 규칙을 배경 없이 쓴다. */
export const 방향: Story = {
  render: () => (
    <div className="flex gap-3">
      <TrendText direction="up" value="+2.4%" />
      <TrendText direction="down" value="-1.1%" />
      <TrendText direction="flat" value="0.0%" />
    </div>
  ),
}

/** 아이콘을 붙일 수도 있지만, 테이블 셀처럼 좁은 자리에서는 기본값(아이콘 없음)을 쓴다. */
export const 아이콘: Story = {
  render: () => (
    <div className="flex gap-3">
      <TrendText direction="up" value="+2.4%" showIcon />
      <TrendText direction="down" value="-1.1%" showIcon />
      <TrendText direction="flat" value="0.0%" showIcon />
    </div>
  ),
}

/** 원자재/비용/리스크처럼 내려가야 좋은 지표는 invert로 색을 뒤집는다. */
export const 색반전: Story = {
  render: () => (
    <div className="flex gap-3">
      <TrendText direction="up" value="+3.2%" invert />
      <TrendText direction="down" value="-0.8%" invert />
    </div>
  ),
}

/** 테이블 셀에서 쓰는 예시. */
export const 테이블셀: Story = {
  render: () => (
    <table className="w-64 text-sm">
      <tbody>
        <tr className="border-b border-[var(--ds-border)]">
          <td className="py-2 text-[var(--ds-text)]">삼성전자</td>
          <td className="py-2 text-right">
            <TrendText direction="up" value="+1,200 (+1.8%)" />
          </td>
        </tr>
        <tr className="border-b border-[var(--ds-border)]">
          <td className="py-2 text-[var(--ds-text)]">SK하이닉스</td>
          <td className="py-2 text-right">
            <TrendText direction="down" value="-3,500 (-2.1%)" />
          </td>
        </tr>
        <tr>
          <td className="py-2 text-[var(--ds-text)]">NAVER</td>
          <td className="py-2 text-right">
            <TrendText direction="flat" value="0 (0.0%)" />
          </td>
        </tr>
      </tbody>
    </table>
  ),
}
