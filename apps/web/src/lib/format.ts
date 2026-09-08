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

/** First letter of the first two words, e.g. "DevQuest 2026" -> "DQ". */
export function initials(text: string): string {
  const words = text.match(/\p{L}+/gu) ?? []
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}
