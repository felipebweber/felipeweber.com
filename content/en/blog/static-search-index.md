---
title: "A static search index that fits in 40 KB"
date: 2026-08-04
slug: "static-search-index"
translationKey: static-search-index
description: "Client-side search on a static site needs no server and no paid service. It needs an index that is honest about what goes into it."
tags: ["performance", "javascript", "hugo"]
---

Search on a static site has three paths: a paid external service, your own
server, or a JSON index built at compile time and queried in the browser. For
a blog the third one is almost always right — as long as the index stays thin.

## What makes an index fat

The common mistake is indexing the full body of every post. Fifty
1,500-word articles turn into a multi-megabyte JSON file the visitor
downloads before typing a single letter.

What actually matters for blog search:

| Field | Good for | Cost |
| --- | --- | --- |
| title | finding the post | tiny |
| description | context in results | low |
| headings | finding the section | low |
| full body | matching an exact phrase | enormous |

In practice title + description + headings answer nearly every real query and
keep the index in the tens of kilobytes.

## Generating it at build time

In Hugo the index is just another output template. The relevant part:

```go-html-template
{{- $index := slice -}}
{{- range where site.RegularPages "Section" "blog" -}}
  {{- $index = $index | append (dict
      "title" .Title
      "url" .RelPermalink
      "desc" .Description
      "headings" (apply .Fragments.Headings "index" "." "Title")
  ) -}}
{{- end -}}
{{ $index | jsonify }}
```

No extra pipeline step: the file is born alongside the HTML.

## Load it late

The index does not need to exist at first paint. Fetch it when the field is
first focused:

```js
let indexPromise;

input.addEventListener("focus", () => {
  indexPromise ??= fetch("/search-index.json").then((r) => r.json());
}, { once: true });
```

Visitors who never search never pay for it. Those who do pay once, and the
browser caches it.

> The best optimization is still not downloading the file.

## Where this breaks

If your use case is matching an exact phrase inside a long document — a
manual, a knowledge base — the reduced index will not do. There it is worth
evaluating [Pagefind](https://pagefind.app/), which shards the index and only
downloads the pieces it needs.

For a blog, that is optimizing a problem you do not have.
