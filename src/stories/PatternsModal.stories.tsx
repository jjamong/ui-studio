import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../components/Modal'
import { FormActions } from '../components/FormActions'
import { Table } from '../components/Table'
import { Tree } from '../components/Tree'
import type { TreeNode } from '../components/Tree'
import { Checkbox } from '../components/Checkbox'
import { DetailRows } from '../components/DetailRows'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Button } from '../components/Button'

const meta: Meta = {
  title: '패턴/모달',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

interface UserRow {
  id: string
  name: string
}

const USER_ROWS: UserRow[] = [
  { id: '1', name: '관리자' },
  { id: '2', name: '김영희' },
  { id: '3', name: '박철수' },
  { id: '4', name: '이민준' },
  { id: '5', name: '최지우' },
]

const TREE_DATA: TreeNode[] = [
  {
    id: 'notice',
    label: '공지사항',
    children: [
      { id: 'notice-1', label: '시스템 점검 안내' },
      { id: 'notice-2', label: '이용약관 개정 안내' },
    ],
  },
  {
    id: 'user',
    label: '사용자',
    children: [
      { id: 'user-1', label: '관리자' },
      { id: 'user-2', label: '일반회원' },
    ],
  },
]

/**
 * 모달의 기본 용도 중 "등록/수정": 폼 필드 + FormActions(취소/제출, 수정이면 삭제도).
 * 레이아웃/상세의 "모달"과 같은 내용이지만, 여기서는 모달 안에 뭘 넣을지(용도)를 기준으로
 * 상세/목록과 나란히 놓고 비교하기 위한 목적이다. Modal 자체(dim 처리된 컨테이너)는
 * 레이아웃 개념이지만, 그 안에 채우는 이 조합들은 컴포넌트 조합이라 패턴이다.
 */
export const 등록: Story = {
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
          <div className="flex flex-col gap-4">
            <Select label="카테고리" value="notice" onChange={() => {}} options={[{ value: 'notice', label: '공지' }]} />
            <Input label="제목" value="시스템 점검 안내" onChange={() => {}} />
            <Input label="작성자" value="관리자" onChange={() => {}} />
          </div>
        </Modal>
      </>
    )
  },
}

/**
 * 모달의 기본 용도 중 "상세": 값을 고치는 폼이 아니라 label/value로 내용만 확인하는
 * 읽기 전용 모달. 직접 dl/dt/dd를 짜는 대신 공용 DetailRows 컴포넌트를 쓴다. 편집 대상이
 * 아니고 헤더의 닫기(X)로 이미 닫을 수 있으므로 footer 자체를 두지 않는다("닫기" 버튼 중복 금지).
 */
export const 상세: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <>
        <Button onClick={() => setOpen(true)}>상세 보기</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="공지사항 상세">
          <DetailRows
            labelWidthClass="w-16"
            rows={[
              { label: '제목', value: '시스템 점검 안내' },
              { label: '작성자', value: '관리자' },
              { label: '등록일', value: '2024-01-15' },
              { label: '상태', value: '게시중' },
            ]}
          />
        </Modal>
      </>
    )
  },
}

/**
 * 모달의 기본 용도 중 "목록": 목록을 띄워 체크박스로 하나 이상을 골라 반영하는 모달.
 * "목록"이라 부르는 만큼 직접 만든 체크리스트가 아니라 패턴/목록이 쓰는 Table을 그대로
 * 가져와 체크박스 컬럼만 얹는다 — 체크박스는 raw input이 아니라 공용 Checkbox 컴포넌트를 쓰고,
 * 헤더의 전체선택 체크박스는 일부만 선택됐을 때 indeterminate로 표시한다. footer는 헤더의
 * 닫기(X)가 취소 역할을 대신하므로 "취소"/선택 개수 없이 "선택" 버튼 하나만 우측에 둔다.
 */
export const 목록: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [checkedIds, setCheckedIds] = useState<string[]>([])

    function toggle(id: string) {
      setCheckedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
    }

    function toggleAll() {
      setCheckedIds((prev) => (prev.length === USER_ROWS.length ? [] : USER_ROWS.map((row) => row.id)))
    }

    return (
      <>
        <Button onClick={() => setOpen(true)}>사용자 선택</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="사용자 선택"
          footer={
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpen(false)}>선택</Button>
            </div>
          }
        >
          <Table<UserRow>
            columns={[
              {
                key: 'check',
                header: (
                  <Checkbox
                    className="font-semibold normal-case text-[var(--ds-text-subtle)]"
                    checked={checkedIds.length === USER_ROWS.length}
                    indeterminate={checkedIds.length > 0 && checkedIds.length < USER_ROWS.length}
                    onChange={toggleAll}
                    label="전체"
                  />
                ),
                widthClass: 'w-16',
                render: (row) => <Checkbox checked={checkedIds.includes(row.id)} onChange={() => toggle(row.id)} />,
              },
              { key: 'name', header: '이름', render: (row) => row.name },
            ]}
            rows={USER_ROWS}
            getRowId={(row) => row.id}
          />
        </Modal>
      </>
    )
  },
}

/**
 * 모달의 네 번째 용도 "트리": 목록과 마찬가지로 골라서 반영하는 모달이지만, 대상이 그룹으로
 * 묶여있어(공지사항/사용자처럼) 계층 구조로 보여줘야 할 때 쓴다. 체크박스를 직접 얹는 게 아니라
 * Tree의 mode="checkable"을 그대로 쓴다 — 그룹을 체크하면 하위 항목이 전부 같이 체크/해제되고,
 * 일부만 체크됐으면 그룹 체크박스가 자동으로 indeterminate가 된다(Tree 내부에서 처리). footer는
 * 목록과 동일하게 "선택" 버튼 하나만 우측에 둔다(취소/개수 표시 없음 — 헤더 닫기(X)가 취소 역할).
 */
export const 트리: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [checkedIds, setCheckedIds] = useState<string[]>([])

    return (
      <>
        <Button onClick={() => setOpen(true)}>대상 선택</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="대상 선택"
          footer={
            <div className="flex w-full justify-end">
              <Button onClick={() => setOpen(false)}>선택</Button>
            </div>
          }
        >
          <Tree
            data={TREE_DATA}
            mode="checkable"
            defaultExpandedIds={['notice', 'user']}
            checkedIds={checkedIds}
            onCheckedChange={setCheckedIds}
          />
        </Modal>
      </>
    )
  },
}
