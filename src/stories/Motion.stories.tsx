import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: '파운데이션/Motion',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

const motionScale: { label: string; durationVar: string }[] = [
  { label: '--ds-motion-duration-fast (120ms)', durationVar: 'var(--ds-motion-duration-fast)' },
  { label: '--ds-motion-duration-base (200ms)', durationVar: 'var(--ds-motion-duration-base)' },
  { label: '--ds-motion-duration-slow (320ms)', durationVar: 'var(--ds-motion-duration-slow)' },
]

/** 재생 버튼을 눌러야 실제로 트랜지션(이징 --ds-motion-ease-standard 포함)이 눈에 보인다 —
 * Storybook 캔버스가 리렌더될 때마다 자동재생되면 오히려 산만해서 수동 트리거로 뒀다. */
function MotionRow({ label, durationVar }: { label: string; durationVar: string }) {
  const [on, setOn] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <code className="w-56 shrink-0 text-xs text-[var(--ds-text-subtle)]">{label}</code>
      <div className="h-8 w-40 rounded-md bg-[var(--ds-background-neutral)]">
        <div
          className="h-8 w-8 rounded-md bg-[var(--ds-background-brand-bold)]"
          style={{
            transform: on ? 'translateX(128px)' : 'translateX(0)',
            transition: `transform ${durationVar} var(--ds-motion-ease-standard)`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className="rounded border border-[var(--ds-border)] px-2 py-1 text-xs text-[var(--ds-text)]"
      >
        재생
      </button>
    </div>
  )
}

export const Duration: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {motionScale.map((m) => (
        <MotionRow key={m.label} label={m.label} durationVar={m.durationVar} />
      ))}
    </div>
  ),
}
