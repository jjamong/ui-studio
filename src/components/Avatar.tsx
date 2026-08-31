import { useState } from 'react'
import { clsx } from 'clsx'

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  className?: string
}

const sizeClass: Record<AvatarSize, string> = {
  sm: 'h-6 w-6 text-2xs',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** 이미지 또는 이니셜을 보여주는 공용 아바타. src가 없거나 로드에 실패하면 이니셜로 대체한다. */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = !!src && !imgError

  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--ds-background-accent-blue-bolder)] font-semibold text-[var(--ds-text-inverse)]',
        sizeClass[size],
        className,
      )}
      title={name}
    >
      {showImage ? (
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
      ) : (
        initialsOf(name)
      )}
    </span>
  )
}
