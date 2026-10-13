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
| `images` | optional list of share images (og:image); defaults to `static/images/og-<lang>.png` |
| `featured` | `true` puts the post in the collapsible "Destaques" box on the home page |
| `draft` | `true` hides it from builds; drop it to publish |

Remove `draft: true` when the post is ready.

## Weekly digest (Digest iOS + AI)

The series is its own section, not part of the blog. Posts are only written in
Brazilian Portuguese. The English menu entry points at `/en/digest/`, which
lists the same Portuguese editions.

```bash
hugo new content/pt/digest/2026-10-16-semana-10-a-16-10-2026.md
```

That uses `archetypes/digest.md`. Drop the file in `content/pt/digest/` even if
you skip `hugo new`. One file per week. Do not add an English twin.

| Key | Required | Effect |
| --- | --- | --- |
| `title` | yes | `Digest iOS + AI no X — semana de 18 a 25/09/2026` |
| `date` | yes | last day of the week (`2026-09-25`); drives order |
| `slug` | yes | URL segment under `/digest/`; keep it stable |
| `week` | yes | range printed at the top of the post, e.g. `18 a 25/09/2026` |
| `description` | yes | listing card, search and meta description |
| `tags` | yes | `digest`, `ios`, `ia` |
| `translationKey` | yes | `digest-YYYY-MM-DD` using the same end date |
| `draft` | no | omit it, or set `false`, to publish |

Same-month ranges look like `18 a 25/09/2026`. Ranges that cross a month look
like `26/09 a 02/10/2026`. Leave out private notes such as angles for `@fbw_`.

## Structure

```
config/_default/     site, language, menu and params configuration
content/pt|en/       content, one tree per language
  digest/            weekly Digest iOS + AI (posts live in pt only)
archetypes/digest.md template for a new weekly edition
layouts/             overrides on top of the Hextra module
  home.html            home page: featured box + list/grid views
  archives.html        chronological archive
  blog/single.html     article template
  digest/list.html     Digest iOS + AI index
  digest/single.html   digest edition template
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

Giscus is wired up but inert until it is configured. Enable Discussions on the
repo, run through <https://giscus.app>, and paste the two ids into
`config/_default/params.yaml`:

```yaml
comments:
  giscus:
    repoId: "..."
    categoryId: "..."
```

The comment section and the "💬 Participe da Discussão" link in the article
header appear as soon as `repoId` is non-empty.

## Analytics

Cookieless Cloudflare Web Analytics. Paste the token into
`params.analytics.cloudflareToken`; the beacon is only emitted in production
builds.
