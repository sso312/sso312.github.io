---
title: "[runInstaller] Unable to verify the graphical display setup"
tags:
    - Oracle
    - 19c
    - 설치
    - X11
date: "2026-06-08"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/05-graphical-display-setup.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

```bash
(GD)[ora19@sso5 /oracle/base/19c]$ ./runInstaller
ERROR: Unable to verify the graphical display setup. This application requires X display. Make sure that xdpyinfo exist under PATH variable.
```

→ Oracle 설치 파일 문제가 아니라 X11 GUI 환경 확인 실패

## 해결
→ xdpyinfo 패키지 설치와 DISPLAY 값 설정

```bash
(GD)[ora19@sso5 /oracle/base/19c]$ su - root
Password:
Last login: Mon Jun  8 16:39:37 KST 2026 on pts/0
[root@sso5 ~]# yum install -y xorg-x11-utils xorg-x11-xauth
```

```bash
(GD)[ora19@sso5 ~]$ cat ~/.bash_profile
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin
umask 022
export EDITOR=vi
export TMOUT=0
export LANG=C
export ORACLE_SID=GD
export ORACLE_UNIQUE_NAME=GD
export ORACLE_BASE=/oracle/base
export ORACLE_HOME=$ORACLE_BASE/19c
export PATH=$ORACLE_HOME/bin:$ORACLE_HOME/OPatch:$PATH
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib
export PS1='($ORACLE_SID)[\u@\h \w]$ '
export ADR_BASE=$ORACLE_BASE/diag
export DISPLAY=localhost:10.0

alias ss='sqlplus / as sysdba'
```
