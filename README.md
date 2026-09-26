# felipeweber.com

Personal site and technical blog. Hugo + [Hextra](https://github.com/imfing/hextra),
bilingual (PT default at `/`, EN at `/en/`), deployed to Cloudflare Pages.

## Requirements

- Hugo **extended** ≥ 0.146 (developed against 0.165)
- Go ≥ 1.21 — Hextra is consumed as a Hugo Module, so Go must be on `PATH`

```bash
brew install hugo go
```

## Running locally

```bash
hugo server
```

The site is served at <http://localhost:1313>. Content changes reload live.

## Writing a post

Posts live under `content/<lang>/blog/` and are published at the dated route
`/{year}/{month}/{day}/{slug}/`.

```bash
hugo new content/pt/blog/meu-post.md
hugo new content/en/blog/my-post.md
```

Front matter that matters:

| Key | Effect |
| --- | --- |
| `date` | drives the URL, the archive grouping and the ordering |
| `slug` | the last URL segment; keep it stable once published |
| `translationKey` | **same value in both languages** — this is what links PT↔EN |
| `description` | shown in the grid cards, search results and `<meta name="description">` |
| `tags` | lowercase, 2–3 per post |
| `featured` | `true` puts the post in the collapsible "Destaques" box on the home page |
| `draft` | `true` hides it from builds; drop it to publish |

Remove `draft: true` when the post is ready.

## Structure

```
config/_default/     site, language, menu and params configuration
content/pt|en/       content, one tree per language
layouts/             overrides on top of the Hextra module
  home.html            home page: featured box + list/grid views
  archives.html        chronological archive
  blog/single.html     article template
  taxonomy.html        /tags/ index
  term.html            /tags/{tag}/
  _partials/aor/       small helpers (month grouping, tag chips, month TOC)
  _partials/sidebar.html   left rail (nav, presence, projects, tag cloud)
assets/css/custom.css  the whole design system, loaded last by Hextra
assets/js/core/aor.js  view switch, featured toggle, month scrollspy
assets/js/head/        pre-paint scripts (no FOUC)
static/fonts/          self-hosted Source Sans 3 / Source Serif 4
```

Hextra itself is never edited: it is a versioned module in `go.mod`, and
project files override it file by file.

```bash
hugo mod get -u github.com/imfing/hextra   # upgrade the theme
```

## Deploying to Cloudflare Pages

Create a Pages project pointed at this repository, then set:

| Setting | Value |
| --- | --- |
| Build command | `hugo --gc --minify --baseURL "$CF_PAGES_URL"` |
| Build output directory | `public` |
| Production branch | `main` |

And these environment variables (**both** are required — the second one is what
makes the Hugo Module resolve):

```
HUGO_VERSION = 0.165.0
GO_VERSION   = 1.27.1
```

Using `$CF_PAGES_URL` keeps branch previews self-consistent; in production the
variable already holds the final domain.

### Domain

Add `felipeweber.com` as a custom domain on the Pages project. With the zone
already on Cloudflare, the DNS record and the TLS certificate are created
automatically.

## Comments

Disqus, wired up but inert until it is configured. Create a site at
<https://disqus.com/admin/create/> and paste its shortname into
`config/_default/params.yaml`:

```yaml
comments:
  disqus:
    shortname: "..."
```

The comment section and the "💬 Participe da Discussão" link in the article
header appear as soon as `shortname` is non-empty. The embed is lazy-loaded
(`layouts/_partials/custom/disqus.html`): Disqus is only contacted when the
reader scrolls near the comments or follows the "Join the Discussion" link.
Each language version of a post has its own thread. Set `comments: false` in a
post's front matter to turn comments off for it.

## Analytics

Cookieless Cloudflare Web Analytics. Paste the token into
`params.analytics.cloudflareToken`; the beacon is only emitted in production
builds.
