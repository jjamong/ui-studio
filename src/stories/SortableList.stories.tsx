import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SortableList } from '../components/SortableList'

interface Item {
  id: string
  label: string
}

const initialItems: Item[] = [
  { id: '1', label: '홈' },
  { id: '2', label: '공지사항' },
  { id: '3', label: '사용자' },
  { id: '4', label: '설정' },
]

const meta: Meta<typeof SortableList> = {
  title: '컴포넌트/SortableList',
  component: SortableList,
}
export default meta

type Story = StoryObj<typeof SortableList>

export const Playground: Story = {
  render: () => {
    const [items, setItems] = useState(initialItems)
    return (
      <div className="w-72">
        <SortableList
          items={items}
          getId={(item) => item.id}
          onReorder={setItems}
          renderItem={(item) => <span className="text-sm text-[var(--ds-text)]">{item.label}</span>}
        />
      </div>
    )
  },
}

/** 구분선 없이 촘촘하게 쓰는 경우 */
export const 구분선없음: Story = {
  render: () => {
    const [items, setItems] = useState(initialItems)
    return (
      <div className="w-72">
        <SortableList
          items={items}
          getId={(item) => item.id}
          onReorder={setItems}
          divided={false}
          renderItem={(item) => <span className="text-sm text-[var(--ds-text)]">{item.label}</span>}
        />
      </div>
    )
  },
}

/** 저장 중 등으로 순서 변경을 잠시 막은 상태 */
export const 비활성: Story = {
  render: () => (
    <div className="w-72">
      <SortableList
        items={initialItems}
        getId={(item) => item.id}
        onReorder={() => {}}
        disabled
        renderItem={(item) => <span className="text-sm text-[var(--ds-text)]">{item.label}</span>}
      />
    </div>
  ),
}
