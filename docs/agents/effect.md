# Effect

**Effect v4** — `4.0.0-rc.112`, pinned in the `catalog:` of `pnpm-workspace.yaml`. v4 is a
rewrite: `Schema`, services/layers, module layout and `Stream` all changed. Most training
data describes v3.

**Read the relevant v4 doc page before writing or modifying Effect code.** Don't answer from
memory, don't port a remembered v3 idiom.

## Fetching

Every page has a markdown twin — append `.md`, same trick as ADR-0009. Fetch that, not the
80 KB HTML page.

```sh
curl -sSL https://effect.website/docs/v4/requirements-management/services.md
```

No twin for `/docs/v4/api` and `/docs/v4/guides`. For API detail the docs don't cover, read
`node_modules/.pnpm/effect@4.0.0-rc.112/node_modules/effect/dist/*.d.ts` or
`github.com/Effect-TS/effect-smol`.

## Index

104 pages, all verified to serve a `.md` twin (2026-09-04). Base `https://effect.website`.

- _(root)_ — `onboarding`, `getting-started`, `runtime`, `configuration`, `batching`
- `getting-started/` — `installation`, `the-effect-type`, `creating-effects`
- `schema/` — `introduction`, `getting-started`, `basic-usage`, `advanced-usage`, `filters`, `transformations`, `projections`, `classes`, `default-constructors`, `annotations`, `effect-data-types`, `equivalence`, `arbitrary`, `json-schema`, `standard-schema`, `formatter`, `error-formatters`, `error-messages`
- `error-management/` — `two-error-types`, `expected-errors`, `unexpected-errors`, `yieldable-errors`, `error-channel-operations`, `error-accumulation`, `parallel-and-sequential-errors`, `matching`, `fallback`, `retrying`, `timing-out`, `sandboxing`
- `requirements-management/` — `services`, `layers`, `layer-memoization`, `default-services`
- `resource-management/` — `introduction`, `scope`
- `concurrency/` — `basic-concurrency`, `fibers`, `deferred`, `queue`, `pubsub`, `semaphore`, `latch`
- `scheduling/` — `introduction`, `built-in-schedules`, `schedule-combinators`, `repetition`, `cron`, `examples`
- `stream/` — `introduction`, `creating`, `operations`, `consuming-streams`, `error-handling`, `resourceful-streams`
- `sink/` — `introduction`, `creating`, `operations`, `leftovers`
- `state-management/` — `ref`, `synchronizedref`, `subscriptionref`
- `caching/` — `cache`, `caching-effects`
- `data-types/` — `option`, `result`, `exit`, `cause`, `data`, `chunk`, `hash-set`, `duration`, `datetime`, `bigdecimal`, `redacted`
- `trait/` — `equal`, `hash`
- `behaviour/` — `equivalence`, `order`
- `code-style/` — `guidelines`, `control-flow`, `pattern-matching`, `branded-types`, `do`, `dual`
- `observability/` — `logging`, `tracing`, `metrics`, `tracking-fibers`
- `platform/` — `introduction`, `runtime`, `file-system`, `path`, `terminal`, `platformlogger`
- `testing/` — `testclock`

To refresh — two sources, since the `/getting-started` sidebar omits the three
`getting-started/*` pages that only `/onboarding` links:

```sh
curl -sSL https://effect.website/docs/v4/getting-started -o /tmp/eff-nav.html
curl -sSL https://effect.website/docs/v4/onboarding.md   -o /tmp/eff-onb.md
grep -hoE '/docs/v4/[a-z0-9/-]+' /tmp/eff-nav.html /tmp/eff-onb.md | sort -u
```

## In this repo

Effect runs server-side and at build time only, never in a browser bundle:
`packages/effect-{collections,markdown,og,rss}/`, `packages/content/`, and
`apps/web/src/server/runtime.ts` (the single runtime) feeding `features/og/` and
`features/feed/`. Tests use `@effect/vitest`.

The `/effect` skill covers opinionated v4 production patterns — use it for "how should I
structure this", the docs above for "what is the actual v4 API".
