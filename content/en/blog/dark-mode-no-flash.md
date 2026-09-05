---
title: "Dark mode with no flash: what happens before first paint"
date: 2026-07-21
slug: "dark-mode-no-flash"
translationKey: dark-mode-no-flash
description: "The white flash when loading a page in dark mode is not a CSS bug. It is a race between the HTML parser and your JavaScript — and it is winnable."
tags: ["css", "javascript", "performance"]
featured: true
---

You implement dark mode, you test it, it works. Then you reload and see a
white flash before the dark theme appears. The classic FOUC.

The cause is not in the CSS. It is in *when* the JavaScript runs.

## The race

The browser builds the page in order: parse HTML, fetch CSS, compute style,
paint. If the script that decides the theme runs *after* that paint, the user
sees the default theme first.

```
parse HTML → fetch CSS → first paint → DOMContentLoaded → your script
                             ▲                                │
                     flash happens here            theme applied here
```

Any script with `defer`, `async`, or bound to `DOMContentLoaded` loses the
race by construction.

## The fix

A **synchronous inline** script in `<head>`, before any stylesheet that
depends on the theme:

```html
<script>
  (function () {
    var stored = localStorage.getItem("color-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  })();
</script>
```

It blocks the parser for well under a millisecond, and the class is already on
`<html>` when the first pixel appears.

## The two details almost everyone forgets

**`color-scheme`.** Without it the browser still paints scrollbars, form
controls and the default canvas in light. It is one line, and it is the
difference between "dark" and *actually* dark.

**`localStorage` can throw.** In some browsers' private mode, accessing it
raises. Wrap it in `try/catch` — the site has to load even when the preference
cannot be read.

> Three states, not two: light, dark and *system*. System is the correct
> default, and the only one that respects someone who changed their OS
> preference after visiting your site.

## Verifying it

The honest test is with CPU throttling on, 6x slowdown, cache disabled. The
flash you cannot see on your desktop shows up immediately on a mid-range
phone.
