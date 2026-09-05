---
title: "Dark mode sem flash: o que acontece antes do primeiro paint"
date: 2026-07-21
slug: "dark-mode-sem-flash"
translationKey: dark-mode-no-flash
description: "O flash branco ao carregar uma página em tema escuro não é um bug de CSS. É uma corrida entre o parser de HTML e o seu JavaScript — e dá para ganhar."
tags: ["css", "javascript", "performance"]
featured: true
---

Você implementa dark mode, testa, funciona. Aí recarrega a página e vê um
lampejo branco antes do tema escuro aparecer. O famoso FOUC.

A causa não está no CSS. Está em quando o JavaScript roda.

## A corrida

O navegador monta a página em ordem: lê o HTML, encontra o CSS, calcula o
estilo, pinta. Se o script que decide o tema roda *depois* dessa pintura, o
usuário vê o tema padrão primeiro.

```
parse HTML → carrega CSS → primeiro paint → DOMContentLoaded → seu script
                                ▲                                  │
                          flash acontece aqui       aplica o tema aqui
```

Qualquer script com `defer`, `async` ou preso ao `DOMContentLoaded` perde a
corrida por construção.

## A correção

Um script **síncrono e inline**, no `<head>`, antes de qualquer folha de
estilo que dependa do tema:

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

Ele bloqueia o parser por menos de um milissegundo e a classe já está no
`<html>` quando o primeiro pixel aparece.

## Os dois detalhes que quase todo mundo esquece

**`color-scheme`.** Sem ele, o navegador continua pintando as barras de
rolagem, os campos de formulário e o fundo padrão em claro. É uma linha, e é a
diferença entre "escuro" e "escuro de verdade".

**`localStorage` pode explodir.** Em modo privado de alguns navegadores, o
acesso lança exceção. Envolva em `try/catch` — o site precisa carregar mesmo
quando a preferência não pode ser lida.

> Três estados, não dois: claro, escuro e *sistema*. "Sistema" é o padrão
> correto, e é o único que respeita quem mudou a preferência no sistema
> operacional depois de visitar seu site.

## Verificando

O teste honesto é com throttling de CPU ligado, em 6x slowdown, com o cache
desabilitado. O flash que você não vê no seu desktop aparece na hora em um
celular intermediário.
