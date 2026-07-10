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
A typed group of MDX documents defined by a schema and a directory. Collections are compiled at build time into typed artifacts consumed by apps.
_Avoid_: collection (alone — too generic), content type

**Reader**:
A function exported by the content package that returns typed, ready-to-use data for a given collection (e.g., `getBlogPosts`). Readers encapsulate filtering, sorting, and shape-mapping. The pipeline behind them is an implementation detail of the package.
_Avoid_: loader, getter, fetcher

**Feature**:
A cohesive area of the site (blog, projects, experiences, talks). Features own their routes, UI components, and server functions. They call readers from the content package and receive typed data — they do not define schemas or touch the content pipeline.
_Avoid_: section, page (a page is a route; a feature is broader)
