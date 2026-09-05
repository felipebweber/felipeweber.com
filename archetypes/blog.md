---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
slug: "{{ .File.ContentBaseName }}"
translationKey: {{ .File.ContentBaseName }}
description: ""
tags: []
featured: false
draft: true
---
