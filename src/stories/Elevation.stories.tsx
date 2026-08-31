import type { Meta, StoryObj } from '@storybook/react-vite'

/** 그림자(깊이)와 z-index(쌓임 순서)는 둘 다 "화면 위로 얼마나 떠 있는가"를 표현하는 같은
 * 개념의 다른 축이라 Elevation 하나로 묶는다(Atlassian/Material 등에서 쓰는 분류 방식). */
const meta: Meta = {
  title: '파운데이션/Elevation',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

const shadowScale: { label: string; token: string }[] = [
  { label: '--ds-shadow-raised', token: 'var(--ds-shadow-raised)' },
  { label: '--ds-shadow-overlay', token: 'var(--ds-shadow-overlay)' },
]

const zIndexScale: { label: string; value: string }[] = [
  { label: '--ds-z-dropdown', value: '50' },
  { label: '--ds-z-toast', value: '100' },
  { label: '--ds-z-modal', value: '150' },
  { label: '--ds-z-route-loading', value: '200' },
]

export const Shadow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-4">
      {shadowScale.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-3">
          <div className="h-16 w-24 rounded-md bg-[var(--ds-surface-raised)]" style={{ boxShadow: s.token }} />
          <code className="text-xs text-[var(--ds-text-subtle)]">{s.label}</code>
        </div>
      ))}
    </div>
  ),
}

export const ZIndex: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      {zIndexScale.map((z) => (
        <div key={z.label} className="flex items-center gap-3 text-xs">
          <code className="w-40 shrink-0 text-[var(--ds-text-subtle)]">{z.label}</code>
          <span className="text-[var(--ds-text)]">{z.value}</span>
        </div>
      ))}
    </div>
  ),
}
