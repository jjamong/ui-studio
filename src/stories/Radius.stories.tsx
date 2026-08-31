import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: '파운데이션/Radius',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

// Tailwind는 클래스 문자열을 정적으로 스캔하므로 radius-*는 리터럴 className으로 명시한다.
const radiusScale: { label: string; className: string }[] = [
  { label: '--radius-sm', className: 'rounded-sm' },
  { label: '--radius-md', className: 'rounded-md' },
  { label: '--radius-lg', className: 'rounded-lg' },
  { label: '--radius-full', className: 'rounded-full' },
]

export const Scale: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {radiusScale.map((r) => (
        <div key={r.label} className="flex flex-col items-center gap-2">
          <div className={`h-16 w-16 border border-[var(--ds-border-focused)] bg-[var(--ds-background-accent-blue-subtle)] ${r.className}`} />
          <code className="text-xs text-[var(--ds-text-subtle)]">{r.label}</code>
        </div>
      ))}
    </div>
  ),
}
