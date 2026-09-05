---
title: "Hugo Modules na prática: temas versionados sem submódulos"
date: 2026-08-18
slug: "hugo-modules-na-pratica"
translationKey: hugo-modules
description: "Git submodules resolvem o problema errado. Hugo Modules trata tema como dependência versionada — com upgrade, rollback e override arquivo a arquivo."
tags: ["hugo", "arquitetura"]
featured: true
---

Todo tutorial de Hugo começa com `git submodule add`. Funciona, mas transforma
o tema numa cópia congelada dentro do seu repositório, sem versão declarada e
sem caminho de upgrade.

Hugo Modules resolve isso tratando o tema como o que ele é: uma dependência.

## O setup

```bash
hugo mod init github.com/seu-usuario/seu-site
hugo mod get github.com/imfing/hextra
```

O `go.mod` gerado registra a versão exata:

```
module github.com/seu-usuario/seu-site

go 1.27.1

require github.com/imfing/hextra v0.12.3
```

No config, o import substitui o antigo `theme:`:

```yaml
module:
  imports:
    - path: github.com/imfing/hextra
```

## Por que isso é melhor

Upgrade vira um comando, e rollback também:

```bash
hugo mod get -u github.com/imfing/hextra   # última versão
hugo mod get github.com/imfing/hextra@v0.12.3  # volta para uma específica
```

Nenhum arquivo do tema entra no seu repositório. O diff de um upgrade é uma
linha no `go.mod`.

## Override arquivo a arquivo

A parte que mais me convenceu: os arquivos do projeto vencem os do módulo, um
a um. Se você quer trocar só o rodapé, cria só o rodapé:

```
layouts/_partials/footer.html
```

O resto do tema continua vindo do módulo e continua recebendo correções nos
upgrades. Comparado a copiar o tema inteiro para dentro do repo, a diferença
de manutenção é enorme.

> A regra prática: se você copiou mais de três arquivos do tema, revise se o
> problema não é de configuração.

## O custo

Você precisa do Go instalado — localmente e no CI. É o preço de entrada, e
vale, porque a partir daí o tema para de ser um bloco opaco no seu histórico
de commits.

O código do Hextra está em
[github.com/imfing/hextra](https://github.com/imfing/hextra) e serve de
referência boa para ver como um tema modular se organiza.
