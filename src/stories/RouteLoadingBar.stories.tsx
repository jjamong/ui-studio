import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RouteLoadingBar } from '../components/RouteLoadingBar'

const meta: Meta<typeof RouteLoadingBar> = {
  title: '컴포넌트/RouteLoadingBar',
  component: RouteLoadingBar,
  parameters: {
    docs: {
      description: {
        component:
          '내부 `<a href>` 클릭을 감지해 시작하고, pathname prop이 실제로 바뀌는 시점에 종료된다. 아래 링크를 클릭해보면 상단에 로딩바가 표시된다.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof RouteLoadingBar>

function Demo() {
  const [pathname, setPathname] = useState('/assets')

  // RouteLoadingBar(자식)의 document click 리스너가 먼저 등록된 뒤에 이 effect가 등록되도록
  // 해서, RouteLoadingBar가 defaultPrevented를 확인하기 전에 로딩을 이미 시작하게 하고
  // 그 다음에 실제 페이지 이동만 막는다(Storybook 프리뷰 iframe이 실제로 이동하지 않도록).
  useEffect(() => {
    function preventDemoNav(e: MouseEvent) {
      if ((e.target as HTMLElement)?.closest('a[data-demo-link]')) e.preventDefault()
    }
    document.addEventListener('click', preventDemoNav)
    return () => document.removeEventListener('click', preventDemoNav)
  }, [])

  return (
    <div className="relative h-40 w-full overflow-hidden rounded border border-[var(--ds-border)]">
      <RouteLoadingBar pathname={pathname} />
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-[var(--ds-text-subtle)]">현재 경로: {pathname}</p>
        <a
          href="/settings"
          data-demo-link
          className="text-sm text-[var(--ds-text-selected)] underline"
          onClick={() => setTimeout(() => setPathname((p) => (p === '/settings' ? '/assets' : '/settings')), 1200)}
        >
          다른 경로로 이동 (1.2초 후 완료)
        </a>
      </div>
    </div>
  )
}

export const Playground: Story = {
  render: () => <Demo />,
}
