---
title: "Escrevendo CSS que sobrevive ao próximo redesign"
date: 2026-06-30
slug: "css-que-sobrevive"
translationKey: css-that-survives
description: "A diferença entre um CSS que dura e um que apodrece não é metodologia. É quantas decisões estão escritas uma vez só."
tags: ["css", "arquitetura"]
---

Todo projeto de frontend chega no ponto em que ninguém quer mexer no CSS. Não
porque está mal escrito — porque ninguém sabe o que quebra.

O sintoma é sempre o mesmo: a mesma decisão está escrita em quinze lugares.

## Tokens antes de componentes

Antes de estilizar qualquer coisa, defina o vocabulário:

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

Trocar o tema inteiro passa a ser trocar esse bloco. Sem tokens, é um
find-and-replace com risco.

## Um tema, uma inversão

Dark mode não é um segundo CSS. É a mesma folha com os tokens redefinidos:

```css
html.dark {
  --surface: #1a1714;
  --text: #ece7de;
  --accent: #e2a05a;
}
```

Se você precisou escrever uma regra `html.dark .componente { ... }`, o
componente está lendo uma cor que deveria ser um token.

## `color-mix` mata a paleta de doze tons

Metade das variáveis de um design system são variações de opacidade da mesma
cor. `color-mix` gera isso na hora:

```css
.card {
  border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
}

.card:hover {
  border-color: color-mix(in srgb, var(--accent) 48%, transparent);
}
```

A borda acompanha o tema sozinha, nos dois modos, sem nenhuma variável nova.

## Medida de leitura é uma decisão, não um acidente

```css
.prose { max-width: 68ch; line-height: 1.7; }
```

Duas linhas que fazem mais pela legibilidade do que qualquer escolha de fonte.
`ch` acompanha o tamanho do texto — se a fonte cresce, a medida cresce junto.

> Se você não consegue explicar por que um valor é `1.7` e não `1.5`, ele vai
> virar `1.6` no próximo PR e ninguém vai saber dizer se melhorou.

## O teste

Pegue o CSS e tente mudar a cor de acento do site inteiro. Se der para fazer
em uma linha, ele sobrevive ao próximo redesign. Se precisar abrir cinco
arquivos, você já sabe onde começar a refatorar.
