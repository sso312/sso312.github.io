---
title: "X display"
tags:
    - Oracle
    - 19c
    - 설치
    - X11
date: "2026-06-08"
---

[Oracle 19c] runInstaller 패키지 X display 문제와 같은 계열의 이슈.

```bash
[root@sso4 ~]# yum install -y xorg-x11-xauth xorg-x11-utils xterm
Loaded plugins: langpacks, product-id, search-disabled-repos, subscription-manager
This system is not registered with an entitlement server. You can use subscription-manager to register.
There are no enabled repos.
```

DISPLAY를 직접 잡을 때 (`:` 다음은 모니터 출력 번호, 만약 안 뜨면 계속 바꿔서 시도)

```bash
[oracle@psh 19c]$ export DISPLAY=10.212.134.202:0.0
```
