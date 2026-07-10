# ADR-0004: MDX rendering pipeline stays in the app

The content package owns _data_ (collection compilation, schema validation, transforms, readers). The app owns _rendering_ — rehype/remark plugins, syntax highlighting, GFM, image auto-import, and the custom `rehype-img-dimensions` plugin all stay in `apps/web/vite.config.ts`.

Rendering is coupled to Vite's MDX compiler and the app's React setup. Moving it into the content package would couple the package to a specific rendering pipeline — a problem when the planned Effect-based pipeline arrives, since it may render MDX differently or not at all.
