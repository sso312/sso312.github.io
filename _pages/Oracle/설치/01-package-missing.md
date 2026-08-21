---
title: "[Oracle 19c Installer] 패키지 미설치 오류"
tags:
    - Oracle
    - 19c
    - 설치
date: "2026-05-27"
---

## 발생 상황
- 작업 일자: 2026-05-27
- 서버 명: sso1
- 사용자: oracle
- 작업 위치: installer
- 작업 목적: OS 설치

## 발생한 에러 메시지
미설치 패키지가 있어서 next가 뜨지 않음

## 해결 방법

아래의 패키지를 root로 가서 설치한다.

```
compat-libcap1-1.10
sysstat-10.1.5
ksh
libaio-devel-0.3.109
```

```bash
(GD)[root@sso5 /home/ora19]$ yum install -y compat-libcap1 sysstat ksh libaio-devel
Loaded plugins: langpacks, product-id, search-disabled-repos, subscription-manager
This system is not registered with an entitlement server. You can use subscription-manager to register.

yum install -y compat-libcap1 ksh libaio-devel
[root@psh oracle]# rpm -ivh compat-libstdc++-33-3.2.3-72.el7.x86_64\ \(1\).rpm
```
