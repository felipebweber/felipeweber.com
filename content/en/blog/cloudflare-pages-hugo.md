---
title: "Shipping a Hugo site on Cloudflare Pages without the headache"
date: 2026-09-02
slug: "cloudflare-pages-hugo"
translationKey: cloudflare-pages-hugo
description: "The short path to a live Hugo site with automatic builds, HTTPS and zero cost — including the three traps that break the first deploy."
tags: ["hugo", "cloudflare", "devops"]
featured: true
---

Putting a static site online stopped being a project. What still eats time is
the first half hour — the one between "works on my machine" and "works in
production, with HTTPS and automatic deploys".

Here is the path I use today.

## The minimum contract

Cloudflare Pages needs three things: a Git repository, a build command and an
output directory. For Hugo:

```bash
# Build command
hugo --gc --minify

# Build output directory
public
```

The rest is environment configuration. And that is where almost every first
deploy fails.

## Trap 1: the Hugo version

The Pages runner does not use the version you have locally. Without pinning,
you get an old one — usually without the extended build, which breaks any
theme that touches SCSS.

Set the environment variable in the project settings:

```bash
HUGO_VERSION = 0.165.0
```

> Pin the version in the repository too, in a file people can actually read.
> An invisible environment variable is technical debt waiting to happen.

## Trap 2: Hugo Modules need Go

If the theme ships as a Hugo Module — and most do now — the runner needs Go
available before `hugo` runs:

```bash
GO_VERSION = 1.27.1
```

Without it the build dies with a `module not found` that says nothing about
the actual cause.

## Trap 3: `baseURL` and previews

Every branch gets its own preview URL. If `baseURL` is hardcoded in the
config, the preview's absolute links point at production. The fix is to let
Pages inject the value:

```bash
hugo --gc --minify --baseURL "$CF_PAGES_URL"
```

In production `CF_PAGES_URL` is the final domain, so one command covers both
cases with no branching.

## What you get for free

After that, every `git push` to `main` is a deploy. Branches become previews.
The certificate is issued and renewed on its own. And the cost stays at zero
up to traffic most personal blogs will never see.

The official docs live at
[developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/),
and the build configuration section is worth reading before the first deploy.
