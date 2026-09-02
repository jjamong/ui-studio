import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContentArea } from '../components/ContentArea'
import { Breadcrumb } from '../components/Breadcrumb'

const meta: Meta = {
  title: '패턴/컨텐츠',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

/** ContentArea 안에 제목만 두는 조합 — 값은 '레이아웃/기본틀'과 동일(h1, text-lg font-bold, mb-2). */
export const 컨텐츠제목: Story = {
  render: () => (
    <div className="bg-[var(--ds-surface-sunken)] p-4">
      <ContentArea>
        <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">상세</h1>
      </ContentArea>
    </div>
  ),
}

/** ContentArea 안에 브레드크럼만 두는 조합 — 값은 '레이아웃/기본틀'과 동일(mb-4). */
export const 컨텐츠브레드크럼: Story = {
  render: () => (
    <div className="bg-[var(--ds-surface-sunken)] p-4">
      <ContentArea>
        <div className="mb-4">
          <Breadcrumb items={[{ label: '공지사항', onClick: () => {} }, { label: '상세' }]} />
        </div>
      </ContentArea>
    </div>
  ),
}

/** ContentArea 안에 브레드크럼 + 제목을 함께 두는 조합 — '레이아웃/기본틀'이 쓰는 전체 헤더 구성. */
export const 컨텐츠제목브레드크럼: Story = {
  render: () => (
    <div className="bg-[var(--ds-surface-sunken)] p-4">
      <ContentArea>
        <div className="mb-4">
          <Breadcrumb items={[{ label: '공지사항', onClick: () => {} }, { label: '상세' }]} />
        </div>
        <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">상세</h1>
      </ContentArea>
    </div>
  ),
}
