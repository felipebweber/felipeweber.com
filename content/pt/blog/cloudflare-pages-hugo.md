---
title: "Publicando um site Hugo na Cloudflare Pages sem dor de cabeça"
date: 2026-09-02
slug: "cloudflare-pages-hugo"
translationKey: cloudflare-pages-hugo
description: "O caminho curto para colocar um site Hugo no ar com build automático, HTTPS e custo zero — incluindo as três armadilhas que travam o primeiro deploy."
tags: ["hugo", "cloudflare", "devops"]
featured: true
---

Colocar um site estático no ar deixou de ser um projeto. O que ainda consome
tempo é a primeira meia hora — a que separa "funciona na minha máquina" de
"funciona em produção com HTTPS e deploy automático".

Este é o caminho que uso hoje.

## O contrato mínimo

A Cloudflare Pages precisa de três coisas: um repositório Git, um comando de
build e um diretório de saída. Para Hugo:

```bash
# Build command
hugo --gc --minify

# Build output directory
public
```

O resto é configuração de ambiente. E é aqui que quase todo primeiro deploy
falha.

## Armadilha 1: a versão do Hugo

O runner da Pages não usa a mesma versão que você tem localmente. Sem fixar,
você recebe uma versão antiga — normalmente sem o build extended, o que quebra
qualquer tema que use SCSS.

Defina a variável de ambiente no painel do projeto:

```bash
HUGO_VERSION = 0.165.0
```

> Fixe a versão no repositório também, num arquivo que o time consiga ler.
> Uma variável de ambiente invisível é uma dívida técnica esperando acontecer.

## Armadilha 2: Hugo Modules precisa de Go

Se o tema vem como Hugo Module — e hoje a maioria vem — o runner precisa do Go
disponível antes do `hugo` rodar:

```bash
GO_VERSION = 1.27.1
```

Sem isso o build morre com um `module not found` que não diz nada sobre a
causa real.

## Armadilha 3: `baseURL` e os previews

Cada branch gera uma URL de preview própria. Se o `baseURL` estiver cravado no
config, os links absolutos do preview apontam para produção. A saída é deixar
a própria Pages injetar o valor:

```bash
hugo --gc --minify --baseURL "$CF_PAGES_URL"
```

Em produção o `CF_PAGES_URL` é o domínio final, então o comando serve para os
dois casos sem `if`.

## O que você ganha de graça

Feito isso, cada `git push` na `main` vira um deploy. Branches viram previews.
O certificado é emitido e renovado sozinho. E o custo continua zero até um
volume de tráfego que a maioria dos blogs pessoais nunca vai ver.

A documentação oficial está em
[developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/) e
vale a leitura da seção de build configuration antes do primeiro deploy.
