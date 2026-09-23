---
name: case-study
description: Case study writing for a portfolio project's detail page. Use when drafting, rewriting, or reviewing a project page.
---

# Case study

A case study is the detail page behind a project card. Its reader is deciding whether to hire or work with the author: a recruiter scanning for relevant technologies and fit, and a developer judging how the author solves problems. Neither will explore a live demo or dig through the source. The page is a **tour guide**: it walks them straight to the most impressive parts and tells the **story** of how the project came to be, which a screenshot and a paragraph never can.

In this repo, case studies are `content/case-studies/<slug>/index.mdx`, with the client described in `client`, never named.

Drafting runs steps 1 to 3. Reviewing an existing page runs step 1 on that page, then step 3, and reports each gap as the section or signal it breaks plus the question to put to the author.

## 1. Gather material

Collect facts before writing a sentence. Read what exists: the current page and its frontmatter, the repo README, the commit history. Then ask the author for what only they know: motivation, collaborators, where they got stuck, who uses it now, how it changed their later work.

Every sentence in the case study states something true. Where a fact is missing, ask; a shorter page beats a plausible invented hurdle or lesson.

Done when every section of the outline in step 2 either has concrete material (a named problem, a named tool, a real decision) or is dropped with the author's agreement.

## 2. Draft along the outline

Sections in order. Rename headings to fit the author's voice (existing pages use "The problem", "The idea") and deviate when the project calls for it; the questions are what each section must answer.

### Introduction

- What the project is, in one or two sentences.
- Its core features, leading with the interesting ones.
- The author's role: development only, or design too? On a team, which parts were theirs? Where did the design come from?
- Technologies used, each with why it was chosen. The explanation turns a tag list into evidence of judgement.
- Links to the live demo and source, as proof the thing exists. Keep them low-key: few readers click, and those who do check for ten seconds.

### Purpose and goal

- Why build it, why it matters to the author, what inspired it.
- The expected outcome, the initial designs or sketches, and any planning (phases, scope cuts) that sets up the narrative.

### Spotlight

The centre of gravity. Write it for a developer, and go deep.

- The killer feature: what took the most work or is the most technically impressive (auth, a data feed, a tricky UI element like drag-and-drop).
- The hurdles: where the author got stuck, technical and non-technical (a late client request, a design disagreement).
- The resolution: how each hurdle was solved, in enough detail that a developer can follow the reasoning.

### Current status (optional)

Only when real people use it: who, why, what they say about it. Drop it for projects built only to be shown.

### Lessons learned

- What the author learned, technical and non-technical (project management, shipping).
- Whether the framework and tools were a good choice, and where they fell short.
- Accessibility: what was tested (keyboard, screen reader) and what it taught.
- How the project changed the author's later work, with a real example.

Weave screenshots, early sketches and process photos into the sections, each beside the text it illustrates. A video walkthrough goes near the top, with its content repeated in text for readers who skip it.

Done when every kept section answers its questions with specifics.

## 3. Review against the signals

Read the draft as the hiring reader. Done when each signal below is carried by a concrete passage you can point to, and each format check holds.

**Signals**

- **Competence**, shown rather than told. Name the thorny problems solved (feature flags to ship a site in phases, a headless API integration) and let the reader conclude the rest. Turn every self-assessment ("great coder", "amazing project") into the evidence behind it.
- **Enthusiasm**, carried by what the author did beyond what was required. Turn every statement of excitement into an example of it.
- **Humility and grit**: difficulties named and framed as lessons, the author's level reading as still growing. The model line: "I now spend a lot more time refactoring and improving every line of code I write, for the best readability and far fewer headaches."
- **Story**: context and history around the finished product. The details that add colour are the ones most often missing: why this subject, how the collaboration went, which roadblocks hit.
- **Honest framing**: each accurate detail in its strongest honest light. What feels mundane to the author often impresses the reader: "worked on the store floor" is also "guided customers towards purchases that fit their needs".

**Format**

- **Skimmable**: many headings, lists inside them, short paragraphs. The core message survives a fast scroll. Aim for 2 to 3 printed pages, more with images.
- **Conversational**: read it aloud; it should sound like something the author would say to a person. Rewrite corporate phrasing until it does, within the register the author chooses.

_Source: Josh Comeau, Building an Effective Dev Portfolio (2020), chapters II to IV._
