---
title: "[Oracle 19c] runInstaller 패키지 X display"
tags:
    - Oracle
    - 19c
    - 설치
    - X11
date: "2026-05-27"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/02-runinstaller-x-display.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

## 발생 상황
- 작업 일자: 2026-05-27
- 서버 명: sso1
- 사용자: oracle
- 작업 위치: `(GD)[oracle@sso1 /oracle/base/19c]$`
- 작업 목적: runInstaller 실행

## 실행한 명령어
```bash
(GD)[oracle@sso1 /oracle/base/19c]$ ./runInstaller
```

## 발생한 에러 메시지
```
ERROR: Unable to verify the graphical display setup. This application requires X display. Make sure that xdpyinfo exist under PATH variable.

No X11 DISPLAY variable was set, but this program performed an operation which requires it.
```

## 원인 분석
- 어떤 명령어에서 발생했는지: runInstaller 실행 시 발생
- 에러의 핵심 키워드: X11 DISPLAY
- 원인: runInstaller는 GUI 설치 프로그램인데, 현재 SSH 접속 세션에 X11 화면 전달 설정이 없어서 Oracle 설치 화면을 띄우지 못한 상태
- 관련 파일/패키지/서비스: xorg-x11-xauth, xorg-x11-utils 패키지

## 해결 방법
```bash
# root에서 필요한 패키지 설치
su - root
yum install -y xorg-x11-xauth xorg-x11-utils xterm
```

## 해결 결과 확인
```bash
[root@sso1 ~]# which xdpyinfo
/usr/bin/xdpyinfo
[root@sso1 ~]# which xauth
/usr/bin/xauth
```

## 최종 정리
- 문제: runInstaller 실행 중 필수 패키지 미설치
- 원인: GUI 설치 시 SSH X11 forwarding을 사용해야 하므로 X11 관련 패키지 없음
- 해결: xorg-x11-xauth, xorg-x11-utils 패키지를 설치
- 재발 방지: 필요 패키지 미리 설치
