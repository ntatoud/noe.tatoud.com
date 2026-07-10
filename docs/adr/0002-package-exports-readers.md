# ADR-0002: Package exports reader functions, not raw collections

The content package (`@ntatoud/content`) exports typed reader functions (e.g., `getBlogPosts()`) rather than raw generated artifacts or bare types. A future migration to a custom Effect-based content pipeline is planned; readers provide a stable API seam so the package internals can be swapped without app changes.
