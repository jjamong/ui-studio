import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LogViewer } from '../components/LogViewer'
import type { LogEntry, LogLevel } from '../components/LogViewer'

const meta: Meta<typeof LogViewer> = {
  title: '컴포넌트/LogViewer',
  component: LogViewer,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof LogViewer>

const sampleEntries: LogEntry[] = [
  { id: '1', timestamp: '10:21:03', level: 'info', message: 'server listening on :4000' },
  { id: '2', timestamp: '10:21:05', level: 'debug', message: 'GET /api/assets 200 12ms' },
  { id: '3', timestamp: '10:21:08', level: 'warn', message: 'slow query: assets.findMany took 480ms' },
  { id: '4', timestamp: '10:21:10', level: 'error', message: 'ECONNREFUSED 127.0.0.1:5432 — retrying in 3s' },
  { id: '5', timestamp: '10:21:13', level: 'trace', message: 'cache miss for key asset:1029' },
]

export const Playground: Story = {
  render: () => (
    <div className="w-[520px]">
      <LogViewer entries={sampleEntries} />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="w-[520px]">
      <LogViewer entries={[]} />
    </div>
  ),
}

const levels: LogLevel[] = ['info', 'info', 'debug', 'warn', 'error']

/** 실제 서버 로그처럼 계속 라인이 추가되는 상황. 아래쪽을 보고 있으면 자동 스크롤되고, 위로 스크롤해 과거 로그를 보는 동안은 멈춘다. */
export const 실시간스트리밍: Story = {
  render: () => {
    const [entries, setEntries] = useState<LogEntry[]>(sampleEntries)

    useEffect(() => {
      const timer = setInterval(() => {
        setEntries((prev) => {
          const level = levels[Math.floor(Math.random() * levels.length)]
          const next: LogEntry = {
            id: String(prev.length + 1),
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
            level,
            message: `heartbeat #${prev.length + 1} ok`,
          }
          return [...prev, next]
        })
      }, 1200)
      return () => clearInterval(timer)
    }, [])

    return (
      <div className="w-[520px]">
        <LogViewer entries={entries} maxHeightClass="max-h-64" />
      </div>
    )
  },
}
