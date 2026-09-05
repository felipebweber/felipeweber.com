---
title: "Um índice de busca estático que cabe em 40 KB"
date: 2026-08-04
slug: "indice-de-busca-estatico"
translationKey: static-search-index
description: "Busca client-side em site estático não precisa de servidor nem de serviço pago. Precisa de um índice honesto sobre o que entra nele."
tags: ["performance", "javascript", "hugo"]
---

Busca em site estático tem três caminhos: serviço externo pago, servidor
próprio, ou um índice JSON gerado no build e consultado no navegador. Para um
blog, o terceiro é quase sempre o certo — desde que o índice não engorde.

## O que faz o índice crescer

O erro comum é indexar o conteúdo inteiro de cada post. Cinquenta artigos de
1.500 palavras viram um JSON de vários megabytes, que o visitante baixa antes
de digitar a primeira letra.

O que realmente importa para uma busca de blog:

| Campo | Serve para | Custo |
| --- | --- | --- |
| título | achar o post | baixíssimo |
| descrição | contexto no resultado | baixo |
| headings | achar a seção | baixo |
| corpo completo | achar uma frase exata | altíssimo |

Na prática, título + descrição + headings resolvem quase toda busca real e
mantêm o índice em dezenas de kilobytes.

## Gerando o índice no build

Em Hugo, o índice é só mais um template de saída. A parte relevante:

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

Nenhum passo extra no pipeline: o arquivo nasce junto com o HTML.

## Carregue tarde

O índice não precisa existir no primeiro paint. Busque no primeiro foco do
campo:

```js
let indexPromise;

input.addEventListener("focus", () => {
  indexPromise ??= fetch("/search-index.json").then((r) => r.json());
}, { once: true });
```

Quem nunca usa a busca nunca paga por ela. Quem usa paga uma vez, e o
navegador cacheia.

> A melhor otimização continua sendo não baixar o arquivo.

## Onde isso quebra

Se o seu caso de uso é achar uma frase exata dentro de um artigo longo — um
manual, uma base de conhecimento — o índice reduzido não serve. Aí vale
avaliar [Pagefind](https://pagefind.app/), que fragmenta o índice e baixa só
os pedaços necessários.

Para um blog, é otimizar um problema que você não tem.
