import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../components/Modal'
import { DetailPageLayout } from '../components/DetailPageLayout'
import { FormActions } from '../components/FormActions'
import { Breadcrumb } from '../components/Breadcrumb'
import { ContentArea } from '../components/ContentArea'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Button } from '../components/Button'

const meta: Meta = {
  title: '레이아웃/상세',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

function SampleFields() {
  return (
    <div className="flex flex-col gap-4">
      <Select label="카테고리" value="notice" onChange={() => {}} options={[{ value: 'notice', label: '공지' }]} />
      <Input label="제목" value="시스템 점검 안내" onChange={() => {}} />
      <Input label="작성자" value="관리자" onChange={() => {}} />
    </div>
  )
}

/**
 * 상세 확인/등록/수정을 dim 처리된 오버레이(Modal)로 띄우는 레이아웃. 같은 폼(SampleFields)과
 * 같은 버튼 배치(FormActions)를 페이지 레이아웃(아래 "페이지")에서도 그대로 재사용해서,
 * footer 버튼 순서(삭제-왼쪽 / 취소·제출-오른쪽)가 두 레이아웃에서 동일하게 보인다.
 */
export const 모달: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달로 수정</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="공지사항 수정"
          footer={<FormActions onCancel={() => setOpen(false)} onSubmit={() => setOpen(false)} submitLabel="수정" onDelete={() => setOpen(false)} />}
        >
          <SampleFields />
        </Modal>
      </>
    )
  },
}

/**
 * 상세 확인/등록/수정을 별도 페이지에서 처리하는 레이아웃. 페이지는 이미 ContentArea 안에
 * 있으므로 DetailPageLayout은 자체 테두리 박스 없이 브레드크럼 -> 제목 -> 본문 -> footer만
 * 세로로 배치한다(이중 테두리 금지 — ContentArea 문서 참고).
 */
export const 페이지: Story = {
  render: () => (
    <ContentArea className="h-[520px]">
      <DetailPageLayout
        title="공지사항 수정"
        breadcrumb={<Breadcrumb items={[{ label: '공지사항', href: '#' }, { label: '시스템 점검 안내' }]} />}
        footer={<FormActions onCancel={() => {}} onSubmit={() => {}} submitLabel="수정" onDelete={() => {}} />}
      >
        <SampleFields />
      </DetailPageLayout>
    </ContentArea>
  ),
}
