---
title: "ERROR: The home is not clean. This home cannot be used since there was a failed OPatch execution"
tags:
    - Oracle
    - OPatch
    - 설치
date: "2026-06-16"
---

```bash
[oracle@psh 38906621]$ cd $ORACLE_HOME
[oracle@psh 19c]$ ./runInstaller -applyRU /home/oracle/media/39062956/38906621

ERROR: The home is not clean. This home cannot be used since there was a failed OPatch execution in this home. Use a different home to proceed.
```

## 원인
이 Oracle Home에서 이전 패치 작업이 실패한 기록/중간 상태가 남아 있음. 그래서 `runInstaller -applyRU`로는 더 진행할 수 없음.

## 해결
가장 깔끔한 해결은 Oracle Home을 새로 푸는 것이다.
