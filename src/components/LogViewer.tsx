import { useEffect, useRef, useState } from 'react'
import type { ReactNode, UIEvent } from 'react'
import { clsx } from 'clsx'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace'

export interface LogEntry {
  id: string
  timestamp?: string
  level?: LogLevel
  message: string
}

export interface LogViewerProps {
  entries: LogEntry[]
  emptyMessage?: ReactNode
  /** 세로 스크롤 컨테이너 높이 제한(예: 'max-h-80'). Table의 maxHeightClass와 같은 규칙. */
  maxHeightClass?: string
  /** 새 로그가 추가되면 맨 아래로 자동 스크롤. 사용자가 위로 스크롤해 과거 로그를 보는 중이면 그동안은 멈춘다. */
  autoScroll?: boolean
  showTimestamp?: boolean
  className?: string
}

const levelClass: Record<LogLevel, string> = {
  error: 'text-[var(--ds-text-danger)]',
  // 디자인 시스템에 아직 warning 토큰이 없어(Badge/Alert도 danger/success/information뿐) 로컬 앰버로만 사용.
  warn: 'text-amber-600 dark:text-amber-400',
  info: 'text-[var(--ds-text-information)]',
  debug: 'text-[var(--ds-text-subtle)]',
  trace: 'text-[var(--ds-text-subtlest)]',
}

const levelLabel: Record<LogLevel, string> = {
  error: 'ERROR',
  warn: 'WARN',
  info: 'INFO',
  debug: 'DEBUG',
  trace: 'TRACE',
}

/**
 * 서버 로그 같은 실시간 로그를 터미널처럼 보여주는 뷰어. 모노스페이스 + 레벨별 색상.
 * 필터/검색은 갖지 않는다 — 필요하면 SearchActionBar와 조합해서 패턴으로 구성한다.
 */
export function LogViewer({
  entries,
  emptyMessage = '표시할 로그가 없습니다.',
  maxHeightClass = 'max-h-96',
  autoScroll = true,
  showTimestamp = true,
  className,
}: LogViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stickToBottom, setStickToBottom] = useState(true)

  useEffect(() => {
    if (!autoScroll || !stickToBottom) return
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries, autoScroll, stickToBottom])

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setStickToBottom(distanceFromBottom < 24)
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={clsx(
        'overflow-y-auto overflow-x-auto rounded border border-[var(--ds-border)] bg-[var(--ds-surface-sunken)] p-2 font-mono text-xs leading-relaxed',
        maxHeightClass,
        className,
      )}
    >
      {entries.length === 0 ? (
        <p className="text-[var(--ds-text-subtlest)]">{emptyMessage}</p>
      ) : (
        entries.map((entry) => {
          const level = entry.level ?? 'info'
          return (
            <div key={entry.id} className={clsx('flex gap-2', levelClass[level])}>
              {showTimestamp && entry.timestamp && (
                <span className="shrink-0 text-[var(--ds-text-subtlest)]">{entry.timestamp}</span>
              )}
              <span className="shrink-0 font-semibold">[{levelLabel[level]}]</span>
              <span className="whitespace-pre-wrap break-all">{entry.message}</span>
            </div>
          )
        })
      )}
    </div>
  )
}
