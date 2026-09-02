import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

const meta: Meta = {
  title: '레이아웃/로그인',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

/**
 * 로그인 이전 화면의 뼈대: 화면 중앙에 뜨는 카드(로고+타이틀, 아이디/비밀번호, 제출 버튼) 배치 참고.
 * AppShell이 "로그인 이후" 전체 페이지 셸을 보여주는 것과 짝을 이루는, "로그인 이전" 쪽 셸이다.
 *
 * 순수 배치 참고용이라 실제 제출 시 검증/에러 표시/로딩 상태 전환 같은 행동은 다루지 않는다
 * (실제 로그인 페이지처럼 그 부분까지 보고 싶으면 패턴 쪽에 별도로 문서화한다).
 */
export const 로그인: Story = {
  render: () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--ds-surface-sunken)]">
        <div className="flex w-80 flex-col gap-4 rounded border border-[var(--ds-border)] bg-[var(--ds-surface-raised)] p-8 shadow-[var(--ds-shadow-raised)]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded bg-[var(--ds-background-brand-bold)]" />
            <h1 className="text-xl font-bold text-[var(--ds-text)]">로그인</h1>
          </div>

          <Input label="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button>로그인</Button>
        </div>
      </div>
    )
  },
}
