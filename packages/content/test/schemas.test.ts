import { describe, expect, it } from '@effect/vitest'
import { Schema } from 'effect'

import { DateString } from '../schemas/date.ts'

describe('DateString', () => {
  it('accepts the dates content is written with', () => {
    expect(Schema.is(DateString)('2026-04-08')).toBe(true)
    expect(Schema.is(DateString)('2026-04-08T10:30:00Z')).toBe(true)
  })

  it('rejects a date that would sort as NaN', () => {
    expect(Schema.is(DateString)('2026-13-45')).toBe(false)
    expect(Schema.is(DateString)('soon')).toBe(false)
    expect(Schema.is(DateString)('')).toBe(false)
  })
})
