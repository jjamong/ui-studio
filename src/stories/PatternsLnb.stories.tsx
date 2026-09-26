import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home, Megaphone, Users, Settings, FileText } from 'lucide-react'
import { NavRail } from '../components/NavRail'
import type { NavRailEntry, NavRailItem } from '../components/NavRail'
import { TopBar } from '../components/TopBar'

const meta: Meta = {
  title: '패턴/LNB',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const logo = <div className="h-5 w-5 rounded bg-[var(--ds-background-brand-bold)]" />

const flatItems: NavRailItem[] = [
  { key: 'home', label: '홈', icon: <Home size={16} /> },
  { key: 'notice', label: '공지사항', icon: <Megaphone size={16} /> },
  { key: 'user', label: '사용자', icon: <Users size={16} /> },
  { key: 'settings', label: '설정', icon: <Settings size={16} /> },
]

const groupedItems: NavRailEntry[] = [
  { key: 'home', label: '홈', icon: <Home size={16} /> },
  {
    key: 'board',
    label: '게시판',
    items: [
      { key: 'notice', label: '공지사항', icon: <Megaphone size={16} /> },
      { key: 'post', label: '게시글', icon: <FileText size={16} /> },
    ],
  },
  {
    key: 'admin',
    label: '관리',
    items: [
      { key: 'user', label: '사용자', icon: <Users size={16} /> },
      { key: 'settings', label: '설정', icon: <Settings size={16} /> },
    ],
  },
]

/** 활성 항목(`active`)과 클릭 동작(`onClick`)을 주입한다. 실제 프로젝트에서는 라우터 경로로 계산한다. */
function withActive(entries: NavRailEntry[], active: string, onSelect: (key: string) => void): NavRailEntry[] {
  return entries.map((entry) =>
    'items' in entry
      ? { ...entry, items: entry.items.map((item) => ({ ...item, active: item.key === active, onClick: () => onSelect(item.key) })) }
      : { ...entry, active: entry.key === active, onClick: () => onSelect(entry.key) },
  )
}

/** TopBar의 토글 버튼과 NavRail을 조합한 LNB. 토글 버튼과 접힌 아이콘 레일이 세로로 정렬되도록
 * TopBar를 NavRail 위에 둔다. */
function LnbDemo({ items, initialActive, collapsibleSections }: { items: NavRailEntry[]; initialActive: string; collapsibleSections?: boolean }) {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState(initialActive)

  return (
    <div className="flex h-96 flex-col bg-[var(--ds-surface-sunken)]">
      <TopBar logo={logo} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
      <div className="flex min-h-0 flex-1">
        <NavRail
          items={withActive(items, active, setActive)}
          collapsed={collapsed}
          collapsibleSections={collapsibleSections}
        />
      </div>
    </div>
  )
}

/** 가장 기본형: 메뉴를 한 줄로 나열한다. 좌상단 토글 버튼으로 접고 펼친다. */
export const 기본: Story = {
  render: () => <LnbDemo items={flatItems} initialActive="notice" />,
}

/** 메뉴가 많을 때: `NavRailGroup`으로 제목이 달린 섹션으로 묶는다. 섹션 제목은 단순 라벨이다.
 * LNB를 접으면 섹션 제목은 구분선으로 바뀌고 하위 아이콘은 그대로 노출된다. */
export const 섹션: Story = {
  render: () => <LnbDemo items={groupedItems} initialActive="notice" />,
}

/** 섹션 + 열고닫기: `collapsibleSections`를 켜면 섹션 제목을 눌러 하위 메뉴를 접고 펼 수 있다.
 * 활성 항목이 있는 섹션은 펼친 채로 시작하고, LNB를 접으면 섹션 열림 여부와 관계없이 아이콘이 모두 보인다. */
export const 섹션열고닫기: Story = {
  name: '섹션 열고닫기',
  render: () => <LnbDemo items={groupedItems} initialActive="notice" collapsibleSections />,
}
