import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface DetailPageLayoutProps {
  /** 브레드크럼의 마지막 항목이 이미 현재 페이지를 나타내면(예: "작업 수정") 생략한다 —
   * 그러면 제목 없이 브레드크럼만 남는다(패턴/컨텐츠의 '컨텐츠브레드크럼' 조합). */
  title?: ReactNode
  breadcrumb?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/**
 * 모달이 아니라 페이지에서 상세 확인/등록/수정을 할 때 쓰는 페이지 단위 레이아웃. ContentArea
 * 안에 바로 배치하는 용도라 자체 테두리/배경 박스를 두지 않는다 — ContentArea가 이미 그
 * 컨테이너 역할을 하므로 여기서 또 박스를 두르면 이중 테두리가 된다. 브레드크럼/제목 배치와
 * 폰트는 새로 정하지 않고 '레이아웃/기본틀' 페이지 셸이 쓰는 값(브레드크럼 mb-4, 제목 h1
 * text-lg font-bold mb-2)을 그대로 따른다.
 */
export function DetailPageLayout({ title, breadcrumb, children, footer, className }: DetailPageLayoutProps) {
  return (
    <div className={clsx('flex h-full flex-col', className)}>
      {breadcrumb && <div className="mb-4">{breadcrumb}</div>}
      {title && <h1 className="mb-2 text-lg font-bold text-[var(--ds-text)]">{title}</h1>}
      <div className="flex-1 overflow-y-auto">{children}</div>
      {footer && <div className="pt-4">{footer}</div>}
    </div>
  )
}
