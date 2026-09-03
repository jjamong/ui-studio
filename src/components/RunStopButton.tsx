import { forwardRef } from 'react'
import { Play, Square } from 'lucide-react'
import { Button } from './Button'
import type { ButtonProps, ButtonSize } from './Button'

export type RunButtonProps = Omit<ButtonProps, 'icon'>
export type StopButtonProps = Omit<ButtonProps, 'icon'>

const iconSizeBySize: Record<ButtonSize, number> = { sm: 12, md: 14, lg: 16 }

/** 배치 작업 실행 버튼. StatusBadge와 나란히 두는 액션 버튼 쌍(RunButton/StopButton) 중 하나. */
export const RunButton = forwardRef<HTMLButtonElement, RunButtonProps>(
  ({ variant = 'primary', size = 'md', children, ...props }, ref) => (
    <Button ref={ref} variant={variant} size={size} icon={<Play size={iconSizeBySize[size]} />} {...props}>
      {children ?? '실행'}
    </Button>
  ),
)
RunButton.displayName = 'RunButton'

/** 배치 작업 중지 버튼. 실행 중인 작업 옆에 RunButton과 함께 둔다. */
export const StopButton = forwardRef<HTMLButtonElement, StopButtonProps>(
  ({ variant = 'danger', size = 'md', children, ...props }, ref) => (
    <Button ref={ref} variant={variant} size={size} icon={<Square size={iconSizeBySize[size]} />} {...props}>
      {children ?? '중지'}
    </Button>
  ),
)
StopButton.displayName = 'StopButton'
