---
title: "Permission denied"
tags:
    - Oracle
    - 19c
    - 설치
    - Linux
date: "2026-06-08"
---

```
checkdir error:  cannot create apex
                 Permission denied
                 unable to process apex/images/flashchart/anychart_6/swf/maps/asia/taiwan.amap.
```

→ 권한 문제

## 해결 방법
```bash
[root@sso4 ~]# chown -R oracle:oinstall /u01
```

```bash
[oracle@sso4 ~]$ ls -ld $ORACLE_HOME
drwxrwxr-x. 68 oracle oinstall 4096  6월  8 11:01 /u01/app/oracle/product/19c/dbhome_1
```
