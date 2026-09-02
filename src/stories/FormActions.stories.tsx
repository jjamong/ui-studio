import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormActions } from '../components/FormActions'

const meta: Meta<typeof FormActions> = {
  title: '컴포넌트/FormActions',
  component: FormActions,
}
export default meta

type Story = StoryObj<typeof FormActions>

export const 등록: Story = {
  render: () => (
    <div className="w-96 rounded border border-[var(--ds-border)] p-4">
      <FormActions onCancel={() => {}} onSubmit={() => {}} submitLabel="등록" />
    </div>
  ),
}

export const 수정_삭제포함: Story = {
  render: () => (
    <div className="w-96 rounded border border-[var(--ds-border)] p-4">
      <FormActions onCancel={() => {}} onSubmit={() => {}} submitLabel="수정" onDelete={() => {}} />
    </div>
  ),
}
