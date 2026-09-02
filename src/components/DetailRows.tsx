import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export interface DetailRow {
  label: ReactNode
  value: ReactNode
  /** 값 앞에 붙는 강조 점(예: 종류별 색상 표시). */
  dotColor?: string | null
}

export interface DetailRowsProps {
  rows: DetailRow[]
  /** label 칸 너비. 라벨 길이가 길면 넓혀서 쓴다(기본 w-20). */
  labelWidthClass?: string
  className?: string
}

/** 상세 모달/페이지에서 값을 고치지 않고 label/value로만 보여줄 때 쓰는 공용 읽기 전용 목록. */
export function DetailRows({ rows, labelWidthClass = 'w-20', className }: DetailRowsProps) {
  return (
    <dl className={clsx('flex flex-col', className)}>
      {rows.map((row, index) => (
        <div key={index} className="flex gap-3 border-b border-[var(--ds-border)] py-2.5 text-sm last:border-b-0">
          <dt className={clsx('shrink-0 text-[var(--ds-text-subtle)]', labelWidthClass)}>{row.label}</dt>
          <dd className="flex items-center gap-1.5 text-[var(--ds-text)]">
            {row.dotColor && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.dotColor }} />}
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
