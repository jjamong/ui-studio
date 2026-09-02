import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home, Megaphone, Users, Settings } from 'lucide-react'
import { NavRail } from '../components/NavRail'
import { TopBar } from '../components/TopBar'
import { AppShell } from '../components/AppShell'
import { Breadcrumb } from '../components/Breadcrumb'

const meta: Meta = {
  title: '레이아웃/기본틀',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const navItems = [
  { key: 'home', label: '홈', icon: <Home size={16} /> },
  { key: 'notice', label: '공지사항', icon: <Megaphone size={16} /> },
  { key: 'user', label: '사용자', icon: <Users size={16} /> },
  { key: 'settings', label: '설정', icon: <Settings size={16} /> },
]

/** NavRail(lnb) + TopBar(top) + ContentArea(container)를 AppShell로 조합한 참고용 페이지 셸.
 * 각 영역은 소비 프로젝트가 자기 라우터/메뉴 데이터로 만든 엘리먼트를 그대로 AppShell에 넘긴다. */
export const 기본틀: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false)
    const [active, setActive] = useState('notice')

    return (
      <AppShell
        top={
          <TopBar
            logo={<div className="h-5 w-5 rounded bg-[var(--ds-background-brand-bold)]" />}
            title="Design System"
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
          />
        }
        lnb={
          <NavRail
            items={navItems.map((item) => ({ ...item, active: item.key === active, onClick: () => setActive(item.key) }))}
            collapsed={collapsed}
          />
        }
      >
        <div className="mb-4">
          <Breadcrumb items={[{ label: '공지사항', onClick: () => {} }, { label: '상세' }]} />
        </div>
        <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">상세</h1>
        <p className="text-sm text-[var(--ds-text-subtle)]">
          AppShell이 top(TopBar) / lnb(NavRail) / container(ContentArea) 세 영역을 조합한 기본 페이지 셸입니다.
          상단의 토글 버튼으로 NavRail을 접고 펼쳐보세요.
        </p>
      </AppShell>
    )
  },
}
