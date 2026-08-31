import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: '테마',
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

function ColorGroups() {
  return (
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
  )
}

/** 기본(라이트) 값 세트. */
export const Light: Story = {
  parameters: { layout: 'padded' },
  render: () => <ColorGroups />,
}

/**
 * 다크 값 세트만 따로 보는 페이지. data-theme="dark"를 이 페이지 전체를 채우는 컨테이너에
 * 걸어서 스코프했다 — 실제 앱에서는 <html>에 걸면 전체가 다크가 된다(front/src/index.css 참고).
 */
export const Dark: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" className="min-h-screen p-6">
      <ColorGroups />
    </div>
  ),
}

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

export const Typography: Story = {
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
