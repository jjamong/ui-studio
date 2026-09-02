import { clsx } from 'clsx'
import { Button } from './Button'

export interface FormActionsProps {
  onCancel: () => void
  cancelLabel?: string
  onSubmit: () => void
  submitLabel?: string
  submitLoading?: boolean
  submitDisabled?: boolean
  onDelete?: () => void
  deleteLabel?: string
  deleteLoading?: boolean
  className?: string
}

/**
 * 등록/수정 폼의 하단 액션 버튼 배치 패턴. 삭제(danger)는 왼쪽, 취소(secondary)+제출(primary)은
 * 오른쪽에 고정한다 — Modal의 footer와 DetailPageLayout의 footer에 동일하게 꽂아써서 모달/
 * 상세페이지 간 버튼 위치를 통일한다.
 */
export function FormActions({
  onCancel,
  cancelLabel = '취소',
  onSubmit,
  submitLabel = '등록',
  submitLoading = false,
  submitDisabled = false,
  onDelete,
  deleteLabel = '삭제',
  deleteLoading = false,
  className,
}: FormActionsProps) {
  return (
    <div className={clsx('flex w-full items-center gap-2', onDelete ? 'justify-between' : 'justify-end', className)}>
      {onDelete && (
        <Button variant="danger" onClick={onDelete} loading={deleteLoading}>
          {deleteLabel}
        </Button>
      )}
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={onSubmit} loading={submitLoading} disabled={submitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
