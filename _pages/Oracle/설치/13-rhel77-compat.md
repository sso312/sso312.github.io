---
title: "[11gR2] RHEL 7.7 - Oracle 11.2.0.1 호환성 문제"
tags:
    - Oracle
    - 11gR2
    - 설치
date: "2026-06-11"
---

- 11.2.0.1 버전은 RHEL 7.7을 지원하지 않음
- RHEL 7.7은 11.2.0.4만 지원
- 설치 버전을 모를 땐 `runfixup.sh`를 찾으면 확인 가능

```bash
[root@sso5 oracle]# find /tmp -name runfixup.sh -type f
/tmp/CVU_19.0.0.0.0_ora19/runfixup.sh
/tmp/CVU_11.2.0.1.0_oracle/runfixup.sh
[root@sso5 oracle]# /tmp/CVU_11.2.0.1.0_oracle/runfixup.sh
Response file being used is :/tmp/CVU_11.2.0.1.0_oracle/fixup.response
Enable file being used is :/tmp/CVU_11.2.0.1.0_oracle/fixup.enable
Log file location: /tmp/CVU_11.2.0.1.0_oracle/orarun.log
Setting Kernel Parameters...
The value for semmni in response file is not greater than value of semmni for current session. Hence not changing it.
The value for semmni in response file is not greater than value for semmni in /etc/sysctl.conf file. Hence not changing it.
[root@sso5 oracle]#
```
