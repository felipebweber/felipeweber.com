---
title: "Hugo Modules in practice: versioned themes without submodules"
date: 2026-08-18
slug: "hugo-modules-in-practice"
translationKey: hugo-modules
description: "Git submodules solve the wrong problem. Hugo Modules treat the theme as a versioned dependency — with upgrades, rollbacks and file-by-file overrides."
tags: ["hugo", "architecture"]
featured: true
---

Every Hugo tutorial starts with `git submodule add`. It works, but it turns
the theme into a frozen copy inside your repository, with no declared version
and no upgrade path.

Hugo Modules fix that by treating the theme as what it is: a dependency.

## The setup

```bash
hugo mod init github.com/your-user/your-site
hugo mod get github.com/imfing/hextra
```

The generated `go.mod` records the exact version:

```
module github.com/your-user/your-site

go 1.27.1

require github.com/imfing/hextra v0.12.3
```

In the config, the import replaces the old `theme:` key:

```yaml
module:
  imports:
    - path: github.com/imfing/hextra
```

## Why this is better

Upgrading is one command, and so is rolling back:

```bash
hugo mod get -u github.com/imfing/hextra   # latest
hugo mod get github.com/imfing/hextra@v0.12.3  # back to a specific one
```

No theme file ever enters your repository. The diff of an upgrade is one line
in `go.mod`.

## File-by-file overrides

The part that sold me: project files beat module files, one at a time. If you
want to change only the footer, you create only the footer:

```
layouts/_partials/footer.html
```

The rest of the theme keeps coming from the module and keeps receiving fixes
on upgrade. Compared to vendoring the whole theme, the maintenance difference
is large.

> Rule of thumb: if you have copied more than three theme files, check whether
> the problem is actually configuration.

## The cost

You need Go installed — locally and in CI. That is the entry fee, and it is
worth paying, because from then on the theme stops being an opaque blob in
your commit history.

Hextra's source lives at
[github.com/imfing/hextra](https://github.com/imfing/hextra) and is a good
reference for how a modular theme is organized.
