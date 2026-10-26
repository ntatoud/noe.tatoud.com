/**
 * A comparator ordering items by a date, newest first. An item with no date
 * sorts as the epoch, i.e. last.
 */
export const newestFirst =
  <A>(date: (item: A) => string | undefined) =>
  (a: A, b: A): number =>
    new Date(date(b) ?? 0).getTime() - new Date(date(a) ?? 0).getTime()
