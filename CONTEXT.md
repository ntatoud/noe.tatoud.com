# noe.tatoud.com

Personal website & blog. This document captures the domain language used across the project's monorepo.

## Language

**Workspace**:
The pnpm monorepo root. Contains all apps and packages, shared tooling config, and quality gates.
_Avoid_: monorepo, repo (use these only when referring to the git repository itself)

**App**:
A deployable application produced by the monorepo. Currently a single TanStack Start web app.
_Avoid_: service, server

**Package**:
A non-deployable workspace member consumed by apps or other packages. Units of shared code (content, UI, utils).
The content package is named `@ntatoud/content` and is workspace-internal (not published).
_Avoid_: library, module

**Content Collection**:
A typed group of markdown documents defined by a schema and a directory. Collections are read at build time by the content Vite plugin and baked into the bundle as `virtual:content`.
_Avoid_: collection (alone — too generic), content type

**Reader**:
A function in the content package (`readers/`) that returns typed, ready-to-use data for a given collection (e.g., `getBlogPosts`). Readers encapsulate filtering, sorting, and shape-mapping. The pipeline behind them is an implementation detail of the package.
_Avoid_: loader, getter, fetcher

**Feature**:
A cohesive area of the site (blog, projects, experiences, talks). Features own their routes and UI components. They read content from `virtual:content`, whose data the content package's readers produced at build time — they do not define schemas or touch the content pipeline.
_Avoid_: section, page (a page is a route; a feature is broader)

**Hero**:
The identity surface at the top of the home page — name, tagline, photo, and the primary call-to-action ("Read the blog"). Not a section; the opener.
_Avoid_: header (the header is site chrome, the hero is home page content)

**Slice**:
A curated preview of a single collection shown on the home page — a heading, a small ordered subset of items (latest/featured/recent), and a "See all" link to the collection's full route. Four slices exist: Blog, Projects, Talks, Experiences.
_Avoid_: section (a section is any vertical block of a page; a slice is specifically a home-page collection preview)

**Talk**:
A reusable piece of speaking content — a title, description, kind (talk/workshop), optional slides/docs resource, and a markdown body. A talk is delivered at one or more Events.
_Avoid_: presentation, session

**Event**:
A single occurrence of a Talk at a named gathering — event name, city, date, optional link, optional logo. Events are nested inside a Talk's frontmatter, not a standalone collection. (The legacy standalone `events` collection was dropped; the `talks.events[]` field is the surviving representation.)
_Avoid_: meetup, conference (an Event is one attendance, not the gathering itself)

**Stage**:
Legacy name for the Talks feature and its `/stage` route. Renamed to **Talks** at `/talks` in the rebuild. The term "Stage" is retained only for historical reference; do not use it for new work.
_Avoid_: (do not use — prefer "Talks")

**Clay**:
The design system for noe.tatoud.com. Named for its terracotta signature color. Clay provides tokens, components, and guidelines for consistent visual expression across the website, social media, and communication materials.
_Avoid_: theme, skin, brand (use "Clay" or "design system")

**Soft Warmth**:
The design philosophy behind Clay. Earthy, sunlit tones (sand, terracotta, olive), a friendly serif for headings, generous spacing, and very rounded corners. Calm and handmade rather than technical.
_Avoid_: friendly, casual, playful

**Terracotta**:
The signature color of the Clay design system (`oklch(0.58 0.14 38)` in light mode, `oklch(0.7 0.13 42)` in dark mode), exposed as the `clay-*` tonal palette. Serves as the primary accent. Never use pure black or white: always tint toward sand.
_Avoid_: primary color, accent color, brand color, orange

**Olive**:
The secondary color of the Clay design system (`oklch(0.55 0.08 125)`), exposed as the `olive-*` tonal palette. Terracotta's calm counterpoint, used for highlights, badges, and secondary accents, never for primary actions.
_Avoid_: secondary color, green, khaki

**Young Serif**:
The display typeface used for headings in Clay. A soft, single-weight serif (never faux-bolded) that gives the site its handmade voice. Paired with DM Sans for body text.
_Avoid_: heading font, title font

**Styleguide**:
The `/styleguide` route that documents the Clay design system. A single scrollable page with live examples of colors, typography, buttons, and spacing tokens. Serves as both reference and specification.
_Avoid_: design system page, component library, storybook
