---
title: "Database Level Flashback"
tags:
    - Oracle
    - Flashback
date: "2026-08-21"
---

← [Flashback 개요](/Oracle/Flashback/01-overview.html)

- DB 전체를 과거의 특정 시점으로 돌림 (불완전 복구와 비슷한 개념)
- 불완전 복구에 비해 속도가 빠르고 방법도 간단
- 전통적인 복구방식: 장애 발생 시 백업된 데이터파일을 복원하여 리두로그/아카이브로그를 적용시켜 복구
- Flashback Database 방식: 장애 난 데이터파일에 Flashback log를 적용시켜 복구
  - → 필요할 경우 Redo log 사용 (다만 백업 파일 복원 시 시간이 안 걸리기 때문에 빨리 복구 가능한 것)
  - → 기존 방식의 redo log와 archive log 대신에 flashback log라는 것을 주로 사용

## [flashback database 명령어 사용 가능 조건]

- Flashback database 명령어로만 복구해야만 하는 대표적인 장애는 drop user, truncate user 장애
- flashback log에 대한 설정이 먼저 되어 있어야 함
  - DB 아카이브 모드
  - Flashback Database mode로 설정
- → flashback version Query / transaction Query와 flashback table 명령어는 별도 설정 없이 오라클 10g 버전부터 가능

## [환경 설정]

`db_recovery_file_dest`, `db_recovery_file_dest_size`, `db_flashback_retention_target`: 분 단위 파라미터 설정

```sql
SQL> alter system set db_recovery_file_dest_size=10G scope=both;
System altered.

SQL> alter system set db_recovery_file_dest='/home/oracle/fra' scope=both;
System altered.

SQL> alter system set db_flashback_retention_target=30 scope=both;  
System altered.

select name,
       round(space_limit / 1024 / 1024 / 1024, 2) as limit_gb,
       round(space_used / 1024 / 1024 / 1024, 2) as used_gb
from v$recovery_file_dest;

NAME                                                           LIMIT_GB    USED_GB
------------------------------------------------------------ ---------- ----------
/home/oracle/fra                                                     10          0

SQL> select log_mode from v$database;

LOG_MODE
------------
ARCHIVELOG

SQL> alter database flashback on;

Database altered.

SQL> select flashback_on from v$database;

FLASHBACK_ON
------------------
YES
```

## [flashback log]

```sql
[oracle@sso2 flashback]$ pwd
/home/oracle/fra/GD2/flashback
[oracle@sso2 flashback]$ ls -lSh
total 206M
-rw-r----- 1 oracle oinstall 103M Jul 14 00:56 o1_mf_o5cjc4cp_.flb
-rw-r----- 1 oracle oinstall 103M Jul 14 00:56 o1_mf_o5cjc6xg_.flb
```

현재 설정된 DB_RECOVERY_FILE_DEST와 크기 조회

```sql
SQL> col NAME for a20
SQL> select * from v$recovery_file_dest;

NAME                 SPACE_LIMIT SPACE_USED SPACE_RECLAIMABLE NUMBER_OF_FILES     CON_ID
-------------------- ----------- ---------- ----------------- --------------- ----------
/home/oracle/fra      1.0737E+10  226279424                 0               3         0
```

사용량 조회

```sql
SQL> col FILE_TYPE for a30
SQL> r
  1* select * from v$FLASH_RECOVERY_AREA_USAGE

FILE_TYPE                      PERCENT_SPACE_USED PERCENT_SPACE_RECLAIMABLE NUMBER_OF_FILES     CON_ID
------------------------------ ------------------ ------------------------- --------------- ----------
CONTROL FILE                                    0                         0              0           0
REDO LOG                                        0                         0              0           0
ARCHIVED LOG                                    0                         0              0           0
```

운영 중에 경로의 크기 변경 시 아래의 명령어 실행

```sql
alter system set db_recovery_file_dest_size=100m;

SQL> col NAME for a20
SQL> r
  1* select * from v$recovery_file_dest

NAME                 SPACE_LIMIT SPACE_USED SPACE_RECLAIMABLE NUMBER_OF_FILES     CON_ID
-------------------- ----------- ---------- ----------------- --------------- ----------
/home/oracle/fra      1.0737E+10  226279424                 0               3          0
```

→ 해당 경로의 크기가 작을 경우 작업하다 에러 발생 가능성 있음
→ db_recovery_file_dest 관련해서 에러가 나면 아래의 쿼리를 실행하여 원인과 권장사항을 찾을 수 있음

```sql
select file_type,
       percent_space_used,
       percent_space_reclaimable,
       number_of_files,
       con_id
from v$flash_recovery_area_usage
order by file_type;

FILE_TYPE                 USED(%) RECLAIM(%)    FILES CON_ID
------------------------- ------- ---------- -------- ------
ARCHIVED LOG                 0.00       0.00        0      0
AUXILIARY DATAFILE COPY      0.00       0.00        0      0
BACKUP PIECE                 0.11       0.00        1      0
CONTROL FILE                 0.00       0.00        0      0
FLASHBACK LOG                2.00       0.00        2      0
FOREIGN ARCHIVED LOG         0.00       0.00        0      0
IMAGE COPY                   0.00       0.00        0      0
REDO LOG                     0.00       0.00        0      0

8 rows selected.
```

⇒ 해결방안은 아래처럼 크기를 증가시킨 후 다시 작업하면 됨

```sql
alter system set db_recovery_file_dest_size=4G;
```

## [TRUNCATE TABLE 장애 복구하기 (Flashback Database 사용)]

이를 진행하기 위해서는 archive log mode와 flashback database on 환경이 필요하다.

```sql
SQL> create table test03 (no number);

Table created.

SQL> insert into test03 values(1);
1 row created.

SQL> commit;
Commit complete.

SQL> insert into test03 values(2);
1 row created.

SQL> commit;
Commit complete.

SQL> insert into test03 values(3);
1 row created.

SQL> commit;
Commit complete.

SQL> select * from test03;

        NO
----------
         1
         2
         3
```

잘못된 truncate 발생

```sql
SQL> truncate table test03;

Table truncated.

SQL> select * from test03;

no rows selected
```

Truncate 명령어는 Flashback Table이 아닌, Flashback Database로만 가능함

```sql
SQL> alter table test03 enable row movement;

Table altered.

SQL> flashback table test03 to timestamp(systimestamp-interval '1' minute);

Flashback complete.

SQL> select * from test03;

no rows selected
```

Flashback database 명령어를 수행할 때는 `alter database flashback on;` 명령어와 mount 상태, dba 권한이 필요

```sql
SQL> flashback database to timestamp(systimestamp - interval '5' minute);
flashback database to timestamp(systimestamp - interval '5' minute)
*
ERROR at line 1:
ORA-01031: insufficient privileges

SQL> flashback database to timestamp(systimestamp-interval '5' minute);
flashback database to timestamp(systimestamp-interval '5' minute)
*
ERROR at line 1:
ORA-38757: Database must be mounted and not open to FLASHBACK.

SQL> select * from fb_test;

no rows selected

SQL> INSERT INTO fb_test VALUES (1, 'AAA');
1 row created.

SQL> INSERT INTO fb_test VALUES (2, 'BBB');
1 row created.

SQL> COMMIT;
Commit complete.

SQL> CREATE RESTORE POINT before_truncate4 GUARANTEE FLASHBACK DATABASE;

Restore point created.

SQL> truncate table fb_test;

Table truncated.

SQL> shutdown immediate;
Database closed.
Database dismounted.
ORACLE instance shut down.

SQL> startup mount
ORACLE instance started.

Total System Global Area 2516581464 bytes
Fixed Size                  8899672 bytes
Variable Size             620756992 bytes
Database Buffers         1879048192 bytes
Redo Buffers                7876608 bytes
Database mounted.

SQL> flashback database to restore point before_truncate4;

Flashback complete.

SQL> alter database open read only;

Database altered.

SQL> select * from fb_test;

        NO NAME
---------- --------------------
         1 AAA
         2 BBB
```

---

다음: [Flashback Data Archive](/Oracle/Flashback/05-data-archive.html)
