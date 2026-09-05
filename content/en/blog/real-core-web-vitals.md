---
title: "Measuring Core Web Vitals for real on a static site"
date: 2026-05-14
slug: "real-core-web-vitals"
translationKey: real-core-web-vitals
description: "Lighthouse 100 on your MacBook means nothing. The three measurements that actually represent what visitors experience."
tags: ["performance", "web"]
---

Static sites have an unfair advantage in performance: no server thinking, no
hydration, no API waterfall. Scoring 100 in Lighthouse is easy.

Which is exactly why the number misleads.

## Lab is not field

Lighthouse runs a simulation: one machine, one network, one cold load. The
Core Web Vitals Google actually uses come from CrUX — real users, real
devices, real networks, at the 75th percentile.

The two disagree often, and the field wins.

| Measurement | Where it lives | What it answers |
| --- | --- | --- |
| Lighthouse | your terminal / CI | "did I regress since last commit?" |
| CrUX | aggregated real data | "are my visitors suffering?" |
| Your own RUM | your site | "which pages, which devices?" |

## The three metrics, one sentence each

**LCP** — when the largest visible element finished painting. On a blog it is
almost always the title or the first image. A badly configured web font delays
it more than any image will.

**INP** — how long the page takes to respond to an interaction. Static sites
rarely fail here, unless a third-party script is holding the main thread.

**CLS** — how much content jumps during load. Cause number one: images without
`width`/`height`. Cause number two: a font swap that changes text height.

## Measuring on your own site

The official library fits in a few lines and reports real numbers:

```js
import { onLCP, onINP, onCLS } from "web-vitals";

function send(metric) {
  navigator.sendBeacon("/vitals", JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    path: location.pathname,
  }));
}

onLCP(send);
onINP(send);
onCLS(send);
```

`sendBeacon` does not hold navigation — the payload goes out even after the
user has left the page.

## What to fix first on a static site

1. **Fonts.** `font-display: swap`, `preload` only the files used above the
   fold, and serve them from your own domain.
2. **Image dimensions.** Always `width` and `height`, even with responsive CSS
   on top.
3. **Third-party scripts.** Each one is an INP risk you do not control.

> Optimize from the inside out: first what you serve, then what you borrow.

The reference that keeps up with metric definition changes is
[web.dev/vitals](https://web.dev/vitals/).
