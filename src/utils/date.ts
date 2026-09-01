const TOKEN_LENGTHS: Record<string, number> = { YYYY: 4, MM: 2, DD: 2, HH: 2, mm: 2 }
const TOKEN_ORDER = ['YYYY', 'MM', 'DD', 'HH', 'mm']

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/** pattern의 YYYY/MM/DD/HH/mm 토큰을 date 값으로 치환한다. */
export function formatDate(date: Date, pattern: string): string {
  const map: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad2(date.getMonth() + 1),
    DD: pad2(date.getDate()),
    HH: pad2(date.getHours()),
    mm: pad2(date.getMinutes()),
  }
  return pattern.replace(/YYYY|MM|DD|HH|mm/g, (token) => map[token] ?? token)
}

/**
 * raw 문자열에서 숫자만 뽑아 pattern에 등장하는 토큰 순서(YYYY→MM→DD→HH→mm)대로 채운다.
 * 구분자(-, ., /, :, 공백) 유무와 무관하게 "20260901"과 "2026-09-01"을 동일하게 해석한다.
 */
export function parseDigits(raw: string, pattern: string, base?: Date): Date | null {
  const digits = raw.replace(/\D/g, '')
  const tokens = TOKEN_ORDER.filter((token) => pattern.includes(token))
  const result = base ? new Date(base) : new Date()
  result.setHours(0, 0, 0, 0)

  let cursor = 0
  let consumedAny = false
  for (const token of tokens) {
    const len = TOKEN_LENGTHS[token] ?? 0
    const chunk = digits.slice(cursor, cursor + len)
    if (chunk.length < len) break
    consumedAny = true
    cursor += len
    const num = Number(chunk)
    switch (token) {
      case 'YYYY':
        result.setFullYear(num)
        break
      case 'MM':
        result.setMonth(num - 1)
        break
      case 'DD':
        result.setDate(num)
        break
      case 'HH':
        result.setHours(num)
        break
      case 'mm':
        result.setMinutes(num)
        break
    }
  }

  return consumedAny ? result : null
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setDate(1)
  d.setMonth(d.getMonth() + amount)
  return d
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime()
}

export function isAfterDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime()
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const t = startOfDay(date).getTime()
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime()
}

export interface CalendarDay {
  date: Date
  inCurrentMonth: boolean
}

/** viewDate가 속한 달을 6주(42칸) 그리드로 채운다(앞뒤 달 날짜 포함). */
export function getCalendarMatrix(viewDate: Date): CalendarDay[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay())

  const days: CalendarDay[] = []
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i)
    days.push({ date, inCurrentMonth: date.getMonth() === month })
  }
  return days
}
