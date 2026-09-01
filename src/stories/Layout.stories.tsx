import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home, Building2, Wallet, Settings } from 'lucide-react'
import { NavRail } from '../components/NavRail'
import { TopBar } from '../components/TopBar'
import { ContentArea } from '../components/ContentArea'
import { Breadcrumb } from '../components/Breadcrumb'

const meta: Meta = {
  title: '레이아웃/기본틀',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const navItems = [
  { key: 'home', label: '홈', icon: <Home size={16} /> },
  { key: 're', label: '부동산', icon: <Building2 size={16} /> },
  { key: 'cash', label: '현금성 자산', icon: <Wallet size={16} /> },
  { key: 'settings', label: '설정', icon: <Settings size={16} /> },
]

/** NavRail + TopBar + ContentArea 조합. 사이드바/탑바처럼 프로젝트마다 네비 구성이 다른 부분을
 * 소비 프로젝트가 어떻게 조립하는지 보여주는 참고용 페이지 셸이다. */
export const 기본틀: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false)
    const [active, setActive] = useState('re')

    return (
      <div className="flex h-screen w-full flex-col bg-[var(--ds-surface-sunken)]">
        <TopBar
          logo={<div className="h-5 w-5 rounded bg-[var(--ds-background-brand-bold)]" />}
          title="jjamong asset-studio"
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />
        <div className="flex min-h-0 flex-1">
          <NavRail
            items={navItems.map((item) => ({ ...item, active: item.key === active, onClick: () => setActive(item.key) }))}
            collapsed={collapsed}
          />
          <div className="min-w-0 flex-1 overflow-y-auto">
            <ContentArea>
              <div className="mb-4">
                <Breadcrumb items={[{ label: '자산', onClick: () => {} }, { label: '부동산' }]} />
              </div>
              <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">부동산</h1>
              <p className="text-sm text-[var(--ds-text-subtle)]">
                NavRail(좌측 아이콘 레일) + TopBar(상단 바) + ContentArea(본문 컨테이너)를 조합한 기본 페이지 셸입니다.
                상단의 토글 버튼으로 NavRail을 접고 펼쳐보세요.
              </p>
            </ContentArea>
          </div>
        </div>
      </div>
    )
  },
}
