---
title: "-bash: sqlplus: command not found"
tags:
    - Oracle
    - 환경변수
    - 설치
date: "2026-06-22"
---

oracle 계정 환경변수 PATH 문제.

```bash
[oracle@sso2 ~]$ sqlplus / as sysdba
-bash: sqlplus: command not found
```

## 해결: 환경 변수 잡기
```bash
[oracle@sso2 ~]$ cat ~/.bash_profile
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

# User specific environment and startup programs

export ORACLE_SID=GD2
export ORACLE_HOME=/oracle2/base/19c
export ORACLE_BASE=/oracle2/base
export PATH=$ORACLE_HOME/bin:$PATH
```

```bash
[oracle@sso2 ~]$ sqlplus -v

SQL*Plus: Release 19.0.0.0.0 - Production
Version 19.3.0.0.0
```
