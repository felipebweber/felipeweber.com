---
title: "Medindo Core Web Vitals de verdade em um site estático"
date: 2026-05-14
slug: "core-web-vitals-de-verdade"
translationKey: real-core-web-vitals
description: "Lighthouse 100 no seu MacBook não significa nada. As três medições que realmente representam a experiência de quem visita o site."
tags: ["performance", "web"]
---

Site estático tem uma vantagem injusta em performance: não há servidor
pensando, não há hidratação, não há waterfall de API. É fácil tirar 100 no
Lighthouse.

E é exatamente por isso que o número engana.

## Lab não é campo

O Lighthouse roda uma simulação: uma máquina, uma rede, um carregamento frio.
Os Core Web Vitals que o Google usa vêm do CrUX — usuários reais, aparelhos
reais, redes reais, no percentil 75.

Os dois discordam com frequência, e o campo é quem manda.

| Medição | Onde vive | O que responde |
| --- | --- | --- |
| Lighthouse | seu terminal / CI | "eu regredi desde o último commit?" |
| CrUX | dados reais agregados | "meus visitantes estão sofrendo?" |
| RUM próprio | seu site | "quais páginas, quais aparelhos?" |

## As três métricas, em uma frase cada

**LCP** — quando o maior elemento visível terminou de pintar. Num blog, quase
sempre é o título ou a primeira imagem. Fonte web mal configurada atrasa isso
mais do que qualquer imagem.

**INP** — quanto tempo a página leva para responder a uma interação. Site
estático raramente falha aqui, a menos que algum script de terceiro esteja
segurando a thread principal.

**CLS** — o quanto o conteúdo pula durante o carregamento. Causa número um:
imagem sem `width`/`height`. Causa número dois: fonte que troca e muda a
altura do texto.

## Medindo no seu próprio site

A biblioteca oficial cabe em poucas linhas e reporta números reais:

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

`sendBeacon` não segura a navegação — o envio acontece mesmo quando o usuário
já saiu da página.

## O que corrigir primeiro num site estático

1. **Fontes.** `font-display: swap`, `preload` só nos arquivos usados acima da
   dobra, e servidas do seu domínio.
2. **Dimensões de imagem.** Sempre `width` e `height`, mesmo com CSS
   responsivo por cima.
3. **Scripts de terceiro.** Cada um deles é um risco de INP que você não
   controla.

> Otimizar de dentro para fora: primeiro o que você serve, depois o que você
> pede emprestado.

A referência boa continua sendo [web.dev/vitals](https://web.dev/vitals/), que
acompanha as mudanças de definição das métricas ao longo do tempo.
