---
title: "Flashback 개요"
tags:
    - Oracle
    - Flashback
date: "2026-08-21"
bookmark: true
layout: single
categories:
  - Oracle
  - Flashback
permalink: /Oracle/Flashback/01-overview.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

## Flashback 종류
- 사용자의 논리적인 오류를 빠르게 복구해 낼 수 있는 방법
- 논리적인 장애라고 할지라도 flashback 기능으로 복구 할 수 없는 경우가 많음
- 물리적인 장애는 복구할 수 없음
- 9i 버전부터 등장했으나 10g 버전부터 여러가지 기능을 추가로 지원하여 획기적인 기능이 됨

## Flashback 명령어

Flashback 명령어는 크게 3가지로 구분된다.

1. Row Level Flashback → [자세히 보기](/Oracle/Flashback/02-row-level.html)
2. Table Level Flashback → [자세히 보기](/Oracle/Flashback/03-table-level.html)
   - Drop Table 복구하기 (휴지통 활용)
   - Recyclebin 관리하기
3. Database Level Flashback → [자세히 보기](/Oracle/Flashback/04-database-level.html)
   - TRUNCATE TABLE 장애 복구하기 (Flashback Database 사용)

추가로 11g부터는 Flashback Data Archive 기능이 도입되었다 → [자세히 보기](/Oracle/Flashback/05-data-archive.html)

---

## Flashback 기능별 최초 지원 버전 및 구현 방식

| Flashback Operation | 최초 지원 버전 | Implementation | 주요 기능 |
|---|---|---|---|
| Flashback Query | Oracle9i | Undo | 특정 SCN 또는 시점의 과거 데이터를 조회 |
| Flashback Version Query | 10g Release 1 | Undo | 일정 구간에 존재했던 Row의 변경 버전 조회 |
| Flashback Transaction Query | 10g Release 1 | Undo + Supplemental Logging | 트랜잭션별 변경 내용과 UNDO_SQL 조회 |
| Flashback Table | 10g Release 1 | Undo | 테이블을 과거 SCN 또는 시점으로 복원 |
| Flashback Drop | 10g Release 1 | Recycle Bin | DROP TABLE로 삭제한 테이블 복구 |
| Flashback Database | 10g Release 1 | Flashback Logs + Redo Logs | 데이터베이스 전체를 과거 시점으로 되돌림 |
| Flashback Transaction | 11g Release 1 | Undo + Compensating Transaction + Supplemental Logging | 특정 트랜잭션 및 종속 트랜잭션을 온라인 상태에서 취소 |
| Flashback Data Archive | 11g Release 1 | Flashback Archive History Tables + FBDA | 장기간 Row 변경 이력 보관 및 조회 |
| Flashback Pluggable Database | 12c Release 2 | Flashback Logs + Redo Logs, PDB 단위 | 다른 PDB에 영향을 주지 않고 특정 PDB만 되돌림 |
| Separate Flashback Log Destination | 26ai 개선 기능 | DB_FLASHBACK_LOG_DEST | Flashback Log를 FRA 외부의 별도 고속 디스크에 저장 |

## 버전별 Flashback 발전 과정

| Oracle 버전 | 주요 Flashback 기능 및 변경 |
|---|---|
| 9i Release 1 | Flashback Query 최초 제공 |
| 9i Release 2 | SELECT ... AS OF SCN/TIMESTAMP 구문 지원 및 Flashback Query 확장 |
| 10g Release 1 | Flashback Version Query, Transaction Query, Table, Drop, Database 도입 |
| 10g Release 2 | Restore Point 및 Guaranteed Restore Point 활용 확대 |
| 11g Release 1 | Flashback Transaction, Flashback Data Archive 도입 |
| 12c Release 2 | Flashback Pluggable Database, PDB Restore Point 도입 |
| 19c | Data Guard 환경에서 Primary Restore Point의 Standby 전파, Primary Flashback 시 Standby 자동 Flashback 지원 |
| 21c | Flashback Archive 테이블 마이그레이션, Datafile Resize 관련 Flashback Database 지원, Orphan PDB Incarnation Flashback 지원 |
| 23ai | 기존 Flashback 기능 유지 및 Multitenant 중심 기능 지속 |
| 26ai | Flashback Log를 FRA 외부 별도 디스크에 저장하는 DB_FLASHBACK_LOG_DEST 도입 |

## License

| Flashback Operation | Implementation | License |
|---|---|---|
| Flashback Query (9i) | Undo | 별도 Option 없음 |
| Flashback Version Query (10g) | Undo | 별도 Option 없음 |
| Flashback Transaction Query (10g) | Undo | EE Included |
| Flashback Transaction (11g) | Undo | EE Included |
| Flashback Table (10g) | Undo | EE Included |
| Flashback Drop (10g) | Recycle Bin | 별도 Option 없음 |
| Flashback Database (10g) | Flashback Logs + Redo Logs | EE Included |
| Flashback Data Archive (11g) | Flashback Archive | Basic: All Editions |
| Flashback Time Travel Optimization | Optimized History Tables | Advanced Compression Option |
| Flashback PDB (12.2) | Flashback Logs + Redo Logs | EE + Multitenant 조건 |

### 19c 기능별 라이선스

| 기능 | SE2 | EE | 별도 유료 Option |
|---|---|---|---|
| Flashback Table | N | Y | 없음 |
| Flashback Database | N | Y | 없음 |
| Flashback Transaction | N | Y | 없음 |
| Flashback Transaction Query | N | Y | 없음 |
| Basic Flashback Time Travel | Y | Y | 없음 |
| Flashback Time Travel Optimization | N | Y | Advanced Compression |

### 26ai 기능별 라이선스

| 기능 | Free | SE2-ODA | EE | 별도 유료 Option |
|---|---|---|---|---|
| Flashback Table | Y | N | Y | EE에서는 없음 |
| Flashback Database | Y | N | Y | EE에서는 없음 |
| Flashback Transaction | N | N | Y | EE에서는 없음 |
| Flashback Transaction Query | N | N | Y | EE에서는 없음 |
| Basic Flashback Time Travel | Y | Y | Y | 없음 |
| Flashback Time Travel Optimization | N | N | Y | EE에서는 Advanced Compression |

---

Flashback 명령어는 사용 범위에 따라 크게 3가지 (Row Level Flashback, Table Level Flashback, Database Level Flashback)로 구분되며, 이는 모두 **Undo Segment**를 기반으로 동작한다.
