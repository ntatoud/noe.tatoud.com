// End-of-post questions keyed by slug: the posts themselves live in content/blog and stay untouched.
export const POST_PROMPTS: Readonly<Record<string, string>> = {
  'why-i-migrated-from-astro-to-tanstack-start':
    'Did you leave a framework for similar reasons, or did Astro win you back? Tell me how it went.',
  'how-is-ai-changing-the-way-i-work-as-a-developer':
    'How have agents changed the way you work, especially if you are early in your career? I would like to hear your side.',
  'what-is-mcp':
    'Built an MCP server of your own, or hit a wall trying? Tell me what you made.',
}

export const DEFAULT_POST_PROMPT =
  'If this post sparked a thought, a question or a disagreement, I would like to hear it.'
