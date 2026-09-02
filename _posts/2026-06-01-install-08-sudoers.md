---
title: "ora19은(는) sudoers 설정 파일에 없습니다."
tags:
    - Oracle
    - Linux
    - 설치
date: "2026-06-01"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/08-sudoers.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

```
[sudo] ora19의 암호:
ora19은(는) sudoers 설정 파일에 없습니다.  이 시도를 보고합니다.
```

해당 계정이 `/etc/sudoers`에 등록되어 있지 않아 발생하는 문제. `visudo` 또는 `wheel` 그룹 등록으로 해결 가능하다 (세부 원인/해결 내용은 별도 기록되지 않음).
