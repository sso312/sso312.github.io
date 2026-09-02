---
title: "mount: /dev/sr0: failed to setup loop device: No medium found"
tags:
    - Oracle
    - Linux
    - 설치
date: "2026-06-12"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/10-mount-no-medium.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

## 문제
설치 프로그램이 CD/DVD 장치 `/dev/sr0`는 찾았지만, 그 안에 실제 ISO 미디어가 연결되어 있지 않다는 의미.

## 해결
VM 전원을 끄고 하이퍼바이저(예: VMware)의 Edit Settings에서 CD/DVD Drive에 ISO 파일을 다시 연결한다.
