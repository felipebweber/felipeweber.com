---
title: "Writing CSS that survives the next redesign"
date: 2026-06-30
slug: "css-that-survives"
translationKey: css-that-survives
description: "The difference between CSS that lasts and CSS that rots is not methodology. It is how many decisions are written down exactly once."
tags: ["css", "architecture"]
---

Every frontend project reaches the point where nobody wants to touch the CSS.
Not because it is badly written — because nobody knows what will break.

The symptom is always the same: the same decision is written in fifteen
places.

## Tokens before components

Before styling anything, define the vocabulary:

```css
:root {
  --surface: #faf7f0;
  --text: #23201c;
  --text-muted: rgb(35 32 28 / 62%);
  --accent: #9a5b18;
  --radius: 8px;
  --measure: 68ch;
}
```

Swapping the whole theme becomes swapping that block. Without tokens, it is a
find-and-replace with risk attached.

## One theme, one inversion

Dark mode is not a second stylesheet. It is the same sheet with the tokens
redefined:

```css
html.dark {
  --surface: #1a1714;
  --text: #ece7de;
  --accent: #e2a05a;
}
```

If you had to write `html.dark .component { ... }`, the component is reading a
color that should have been a token.

## `color-mix` kills the twelve-shade palette

Half the variables in a design system are opacity variants of the same color.
`color-mix` derives them on the spot:

```css
.card {
  border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
}

.card:hover {
  border-color: color-mix(in srgb, var(--accent) 48%, transparent);
}
```

The border follows the theme on its own, in both modes, with no new variable.

## Measure is a decision, not an accident

```css
.prose { max-width: 68ch; line-height: 1.7; }
```

Two lines that do more for readability than any font choice. `ch` tracks the
text size — if the font grows, the measure grows with it.

> If you cannot explain why a value is `1.7` and not `1.5`, it will become
> `1.6` in the next PR and nobody will be able to say whether that helped.

## The test

Take the stylesheet and try to change the site's accent color. If it is one
line, it survives the next redesign. If it takes five files, you already know
where refactoring starts.
