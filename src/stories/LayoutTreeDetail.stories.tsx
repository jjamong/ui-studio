import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileText, Folder, Plus } from 'lucide-react'
import { TreeDetailLayout } from '../components/TreeDetailLayout'
import { DraggableTree } from '../components/DraggableTree'
import type { TreeNode } from '../components/Tree'
import { ContentArea } from '../components/ContentArea'
import { DetailRows } from '../components/DetailRows'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'
import { Tabs } from '../components/Tabs'

const meta: Meta<typeof TreeDetailLayout> = {
  title: '레이아웃/트리상세',
  component: TreeDetailLayout,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof TreeDetailLayout>

const data: TreeNode[] = [
  {
    id: 'notice',
    label: '공지사항',
    icon: <Folder size={14} />,
    children: [
      { id: 'notice-1', label: '시스템 점검 안내', icon: <FileText size={14} /> },
      { id: 'notice-2', label: '이용약관 개정 안내', icon: <FileText size={14} /> },
    ],
  },
  {
    id: 'user',
    label: '사용자',
    icon: <Folder size={14} />,
    children: [{ id: 'user-1', label: '관리자', icon: <FileText size={14} /> }],
  },
  { id: 'setting', label: '설정', icon: <Folder size={14} /> },
]

function findLabel(nodes: TreeNode[], id: string): string | undefined {
  for (const n of nodes) {
    if (n.id === id) return String(n.label)
    const found = n.children && findLabel(n.children, id)
    if (found) return found
  }
  return undefined
}

/**
 * 왼쪽 트리(DraggableTree)로 고르고 오른쪽에 그 항목의 상세(Tabs + DetailRows)를 보여주는 구성.
 * 오른쪽은 선택한 노드 종류에 따라 내용을 바꿔 넣는다 — 상위 노드면 하위 목록 요약, 하위 노드면 상세.
 * 페이지가 ContentArea 안에 있으므로 레이아웃 자체는 테두리 박스 없이 구분선만 둔다.
 */
export const 트리상세: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | undefined>('notice-1')
    const [tab, setTab] = useState('info')
    const label = selected ? findLabel(data, selected) : undefined
    return (
      <ContentArea className="h-[520px]">
        <TreeDetailLayout
          treeTitle="목록"
          treeActions={
            <Button size="sm" variant="secondary" icon={<Plus size={14} />}>
              등록
            </Button>
          }
          tree={
            <DraggableTree
              data={data}
              size="small"
              selectedId={selected}
              onSelect={setSelected}
              onMove={() => {}}
              defaultExpandedIds={['notice', 'user']}
            />
          }
        >
          {label ? (
            <div className="flex flex-col gap-3">
              <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">{label}</h1>
              <Tabs
                items={[
                  { key: 'info', label: '정보' },
                  { key: 'history', label: '이력' },
                ]}
                activeKey={tab}
                onChange={setTab}
              />
              <DetailRows
                rows={[
                  { label: '이름', value: label },
                  { label: '작성자', value: '관리자' },
                  { label: '상태', value: '게시중' },
                ]}
              />
            </div>
          ) : (
            <EmptyState variant="data" title="왼쪽 트리에서 항목을 고르세요" />
          )}
        </TreeDetailLayout>
      </ContentArea>
    )
  },
}
