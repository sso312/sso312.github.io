---
title: "%pre(oracle-xe-11.2.0-1.0.x86_64) scriptlet failed, exit status 1"
tags:
    - Oracle
    - XE
    - 설치
    - Linux
date: "2026-06-09"
---

MobaXterm 안에서 oracle-xe-11.2.0 설치 중 오류.

```bash
[root@sso5 ~]# cd /home/ora19/Disk1/
[root@sso5 Disk1]# rpm -ivh oracle-xe-11.2.0-1.0.x86_64.rpm
준비 중...                         ################################# [100%]

The install cannot proceed because ORACLE_BASE directory (/u01/app/oracle)
is not owned by "oracle" user. You must change the ownership of ORACLE_BASE
directory to "oracle" user and retry the installation.

오류: %pre(oracle-xe-11.2.0-1.0.x86_64) scriptlet failed, exit status 1
오류: oracle-xe-11.2.0-1.0.x86_64: install failed
```

## 문제
```
drwxrwxr-x. 3 ora19 dba 17  6월  8 13:34 /u01
drwxrwxr-x. 3 ora19 dba 21  6월  8 13:34 /u01/app/oracle
```

| 항목 | 현재 상태 | 문제 |
|---|---|---|
| /u01 소유자 | ora19:dba | XE는 보통 oracle:dba 기준 |
| oracle 계정 | 없음 | XE 설치/기동 계정으로 필요 |
| dba 그룹 | 있는 듯함 | ora19가 dba에 포함됨 |
| hostname | IPv6 link-local만 잡힘 | /etc/hosts에 IPv4 등록 추천 |

## 해결
```bash
useradd -g dba oracle
passwd oracle
```
