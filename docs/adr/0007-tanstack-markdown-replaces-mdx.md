# ADR-0007: `@tanstack/markdown` + `@tanstack/highlight` replace MDX

`packages/effect-mdx` is now `packages/effect-markdown` (`@ntatoud/effect-markdown`), and `MdxCompiler.toJsx` is `MarkdownCompiler.toHtml`. The rendering stack described by ADR-0006 is gone: `@mdx-js/mdx`, `remark-gfm`, `rehype-pretty-code`, `shiki`, and `gray-matter` were all removed and replaced by `@tanstack/markdown` (parse + HTML render) and `@tanstack/highlight` (syntax highlighting). GFM tables, task lists, and footnotes are native to the parser, so `remark-gfm` has no successor. Frontmatter is split off by the parser and decoded with `yaml`, which also retired the `Buffer` shim `gray-matter` needed in the browser.

Both TanStack packages are pre-1.0 (`0.0.12`/`0.0.9`) and pinned exactly.

**Bodies are HTML strings, not React components.** `Document.Content: ComponentType` became `Document.html: string`, and the detail readers return `html` rather than `Content`. This removes the RPC workaround ADR-0006 introduced: the body no longer has to be rendered to a string in `apps/web/src/server/content.tsx`, because it never was a component. `withBodyHtml()` is now `withResolvedImages()` and only rewrites relative image srcs; `renderToStaticMarkup` is gone from both the content server functions and the RSS feed. `@ntatoud/effect-markdown` has no React dependency at all.

**Custom components in content are no longer possible.** `@tanstack/markdown` deliberately does not evaluate JSX or MDX, and its `ComponentNode` escape hatch requires hand-writing a parse extension for a bespoke syntax. Rather than build that, the three content bodies that used React components were converted:

- `content/projects/cowat` — `<ProjectCta>` became a `cta` frontmatter object (`ProjectCtaSchema`), rendered by `apps/web/src/features/projects/project-cta.tsx` after the body.
- `content/projects/start-ui-web` — four `<ProjectInlineLink>` became ordinary markdown links. They now read as inline prose links rather than buttons; this is a deliberate visual change.
- `content/blog/what-is-mcp` — a raw `<ul className=…>` block and an inline `<a className=…>` became a markdown list and a markdown link. `className` is a JSX-ism that does nothing in real HTML, so these were already silently unstyled the moment raw HTML stopped going through MDX.

`apps/web/src/features/projects/mdx-components.tsx` was deleted. Raw HTML in a body is still passed through (`allowHtml: true`) and is _not_ sanitized — content is first-party, so this is a deliberate trade.

**Highlighting is theme-by-CSS.** `@tanstack/highlight` emits semantic classes (`th-token th-keyword`) instead of inline colors; the `github-dark` palette lives in `apps/web/src/styles/highlight.css` as `--th-*` variables. Languages must be registered explicitly in `packages/effect-markdown/languages.ts` — an unregistered fence language falls back to `plaintext` instead of throwing. Fence meta (`title="main.ts"`, `{1,4,12-36}`) is parsed by `@tanstack/markdown` itself; per-fence `showLineNumbers` is not honoured (the renderer only has a document-wide `codeLineNumbers`), which is a no-op here because line numbers were never styled.

`pre code { display: grid }` was removed from `typeset.css`. It was a rehype-pretty-code affordance, and because `@tanstack/highlight` separates lines with real newlines rather than per-line wrappers, leaving it in made every token its own grid row.
