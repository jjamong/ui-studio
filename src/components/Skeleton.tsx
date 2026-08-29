import type { CSSProperties } from 'react'
import { clsx } from 'clsx'

export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle'
  width?: string | number
  height?: string | number
  className?: string
}

/** 로딩 중 레이아웃 형태를 미리 보여주는 공용 스켈레톤. */
export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  const variantClass = {
    circle: 'rounded-full',
    rect: 'rounded',
    text: 'h-3 rounded',
  }[variant]

  const style: CSSProperties = { width, height }

  return (
    <span
      role="status"
      aria-label="데이터 로딩 중"
      style={style}
      className={clsx('inline-block animate-pulse bg-[var(--ds-skeleton)]', variantClass, className)}
    />
  )
}
