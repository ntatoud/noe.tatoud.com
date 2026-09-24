const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date))
}

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

export function formatMonthYear(date: string): string {
  return monthYearFormatter.format(new Date(date))
}

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
})

/** "Mar – Aug 2024" within one year, "Mar 2024 – Sep 2026" across years. */
export function formatMonthRange(start: string, end: string): [string, string] {
  const sameYear =
    new Date(start).getUTCFullYear() === new Date(end).getUTCFullYear()
  return [
    sameYear ? monthFormatter.format(new Date(start)) : formatMonthYear(start),
    formatMonthYear(end),
  ]
}

/** First letter of the first two words, e.g. "DevQuest 2026" -> "DQ". */
export function initials(text: string): string {
  const words = text.match(/\p{L}+/gu) ?? []
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}
