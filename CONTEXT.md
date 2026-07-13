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
A typed group of Documents defined by a schema and a directory (blog, projects, experiences, talks). A collection's items are validated against its schema; Apps consume it only through Readers.
_Avoid_: collection (alone — too generic), content type

**Document**:
A single content item within a Collection — one MDX file (frontmatter + markdown body) rendered to its own page. A blog Document is a _post_; a talks Document is a _Talk_.
_Avoid_: entry, article, page (a page is a route)

**Reader**:
A typed accessor for content. A _collection reader_ returns metadata for a whole collection (e.g. `getBlogPosts` — titles, dates, hero; no body); a _document reader_ returns one Document's metadata plus its rendered body (e.g. `getBlogPost(slug)`). Readers encapsulate filtering, sorting, and shape-mapping; the pipeline behind them is an implementation detail.
_Avoid_: loader, getter, fetcher

**Feature**:
A cohesive area of the site (blog, projects, experiences, talks). Features own their routes, UI components, and server functions. They call readers from the content package and receive typed data — they do not define schemas or touch the content pipeline.
_Avoid_: section, page (a page is a route; a feature is broader)

**Hero**:
The identity surface at the top of the home page — name, tagline, photo, and the two primary calls-to-action ("Read the blog", "Download resume"). Not a section; the opener.
_Avoid_: header (the header is site chrome, the hero is home page content)

**Slice**:
A curated preview of a single collection shown on the home page — a heading, a small ordered subset of items (latest/featured/recent), and a "See all" link to the collection's full route. Four slices exist: Blog, Projects, Talks, Experiences.
_Avoid_: section (a section is any vertical block of a page; a slice is specifically a home-page collection preview)

**Talk**:
A reusable piece of speaking content — a title, description, kind (talk/workshop), optional slides/docs resource, and an MDX body. A talk is delivered at one or more Events.
_Avoid_: presentation, session

**Event**:
A single occurrence of a Talk at a named gathering — event name, city, date, optional link, optional logo. Events are nested inside a Talk's frontmatter, not a standalone collection. (The legacy standalone `events` collection was dropped; the `talks.events[]` field is the surviving representation.)
_Avoid_: meetup, conference (an Event is one attendance, not the gathering itself)

**Achievement**:
An unlockable item in the `/achievements` gamification grid — name, description, locked/unlocked state. Unlocks persist per-browser via localStorage. Discovered via the trophy icon in the header, not primary nav.
_Avoid_: trophy, badge

**Stage**:
Legacy name for the Talks feature and its `/stage` route. Renamed to **Talks** at `/talks` in the rebuild. The term "Stage" is retained only for historical reference; do not use it for new work.
_Avoid_: (do not use — prefer "Talks")
