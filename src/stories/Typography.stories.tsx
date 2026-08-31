import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: '파운데이션/Typography',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

// Tailwind는 클래스 문자열을 정적으로 스캔하므로 템플릿 리터럴(`text-${size}`)로는 클래스가
// 생성되지 않는다 — 각 스케일을 리터럴 className으로 명시한다.
const textScale: { label: string; className: string }[] = [
  { label: 'text-2xs', className: 'text-2xs' },
  { label: 'text-xs', className: 'text-xs' },
  { label: 'text-sm', className: 'text-sm' },
  { label: 'text-base', className: 'text-base' },
  { label: 'text-lg', className: 'text-lg' },
  { label: 'text-xl', className: 'text-xl' },
]

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {textScale.map((size) => (
        <div key={size.label} className="flex items-baseline gap-4">
          <code className="w-20 shrink-0 text-xs text-[var(--ds-text-subtle)]">{size.label}</code>
          <span className={`${size.className} text-[var(--ds-text)]`}>강남 오피스텔 부동산 자산 관리 Design System</span>
        </div>
      ))}
    </div>
  ),
}
