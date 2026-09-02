---
title: "PrereqSession 실패: RawInventory gets null OracleHomeInfo"
tags:
    - Oracle
    - OPatch
    - Windows
    - 설치
date: "2026-06-18"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/20-prereqsession-rawinventory.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

## 상황
Windows 패치 진행 중 충돌 사전 확인 중 발생한 오류.

```
C:\oracd\34468114>C:\oracle\app\oracle\product\19c\db_home\OPatch\opatch prereq CheckConflictAgainstOHWithDetail -ph ./
Oracle Interim 패치 설치 프로그램 버전 12.2.0.1.35
Copyright (c) 2026, Oracle Corporation.  All rights reserved.

PREREQ session

Oracle 홈: C:\oracle\app\oracle\product\19c\db_home
중앙 인벤토리: C:\Program Files\Oracle\Inventory
OPatch 버전: 12.2.0.1.35
OUI 버전: 12.2.0.7.0

Invoking prereq "checkconflictagainstohwithdetail"
List of Homes on this system:
  Home name= OraDB19Home1, Location= "C:\...\WINDOWS.X64_193000_db_home"

Prereq "checkConflictAgainstOHWithDetail" is not executed.
PrereqSession 실패: RawInventory gets null OracleHomeInfo

OPatch failed with error code = 2
```

## 원인 및 해결
1. 먼저 Inventory에 잡힌 Home으로 확인한다.
```
C:\...\WINDOWS.X64_193000_db_home\OPatch\opatch lsinventory -detail -oh C:\...\WINDOWS.X64_193000_db_home
```
2. 성공하면 그 경로가 현재 Inventory에 등록된 Oracle Home이므로, conflict check도 같은 Home의 OPatch로 실행한다.
```
C:\...\WINDOWS.X64_193000_db_home\OPatch\opatch prereq CheckConflictAgainstOHWithDetail -phBaseDir C:\패치압축해제경로\39062956\39036936\39034528
```
3. README 기준 Oracle Home conflict check 대상은 두 개의 패치(39034528, 39039430)이므로 각각 확인한다.
