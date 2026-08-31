import type { Meta, StoryObj } from '@storybook/react-vite'

/** 라이트/다크는 별도 스토리가 아니라 Storybook 툴바의 테마 토글로 전환한다(.storybook/preview.tsx). */
const meta: Meta = {
  title: '파운데이션/Color',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

const colorGroups: { title: string; tokens: string[] }[] = [
  {
    title: 'Text',
    tokens: [
      '--ds-text',
      '--ds-text-subtle',
      '--ds-text-subtlest',
      '--ds-text-disabled',
      '--ds-text-danger',
      '--ds-text-success',
      '--ds-text-information',
      '--ds-text-selected',
    ],
  },
  {
    title: 'Surface',
    tokens: ['--ds-surface', '--ds-surface-sunken', '--ds-surface-overlay'],
  },
  {
    title: 'Background',
    tokens: [
      '--ds-background-neutral',
      '--ds-background-neutral-hovered',
      '--ds-background-brand-bold',
      '--ds-background-brand-bold-hovered',
      '--ds-background-danger',
      '--ds-background-danger-hovered',
      '--ds-background-disabled',
      '--ds-background-information',
      '--ds-background-success',
      '--ds-background-selected',
    ],
  },
  {
    title: 'Border',
    tokens: ['--ds-border', '--ds-border-focused', '--ds-border-danger', '--ds-border-success', '--ds-border-information'],
  },
  {
    title: 'Icon & Skeleton',
    tokens: ['--ds-icon-brand', '--ds-skeleton'],
  },
]

function ColorSwatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-8 w-8 shrink-0 rounded border border-[var(--ds-border)]"
        style={{ background: `var(${token})` }}
      />
      <code className="text-xs text-[var(--ds-text-subtle)]">{token}</code>
    </div>
  )
}

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {colorGroups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-2 text-sm font-bold text-[var(--ds-text)]">{group.title}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {group.tokens.map((token) => (
              <ColorSwatch key={token} token={token} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}
