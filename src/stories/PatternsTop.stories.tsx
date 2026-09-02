import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutDashboard, Megaphone } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { AppSwitcher } from '../components/AppSwitcher'
import type { AppSwitcherItem } from '../components/AppSwitcher'

const meta: Meta = {
  title: '패턴/탑',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const logo = <div className="h-5 w-5 rounded bg-[var(--ds-background-brand-bold)]" />

/** 탑 영역의 가장 기본형: LNB 토글도 우측 슬롯도 없이 로고만 있다. LNB 없이 탑만 쓰는 화면에 쓴다. */
export const 기본: Story = {
  render: () => <TopBar logo={logo} />,
}

/** 탑 영역 + LNB(NavRail) 조합: 로고 옆에 LNB 접기/펼치기 토글 버튼이 붙는다. */
export const LNB: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false)
    return <TopBar logo={logo} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
  },
}

const appSwitcherItems: AppSwitcherItem[] = [
  {
    key: 'dashboard',
    label: '대시보드',
    description: '전체 현황을 한눈에 보는 홈',
    icon: <LayoutDashboard size={18} strokeWidth={2.25} />,
    badgeClassName: 'bg-[var(--ds-background-accent-gray-bolder)]',
    onSelect: () => {},
  },
  {
    key: 'notice',
    label: '공지사항',
    description: '전체 공지/이벤트 관리',
    icon: <Megaphone size={18} strokeWidth={2.25} />,
    badgeClassName: 'bg-[var(--ds-background-accent-blue-bolder)]',
    onSelect: () => {},
  },
]

/** 탑 영역 + 앱 스위칭: 우측 슬롯(right)에 AppSwitcher 버튼을 끼운다. */
export const 앱스위칭: Story = {
  render: () => <TopBar logo={logo} right={<AppSwitcher items={appSwitcherItems} />} />,
}
