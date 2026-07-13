const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date))
}

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
})

export function formatMonthYear(date: string): string {
  return monthYearFormatter.format(new Date(date))
}
