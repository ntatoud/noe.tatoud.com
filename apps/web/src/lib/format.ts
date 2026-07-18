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
