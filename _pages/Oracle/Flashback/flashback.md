---
title: "Flashback"
tags:
    - Oracle
    - Flashback
    - DB 복구
date: "2026-08-21"
---

## 카테고리
기타 (Oracle Flashback)

## Flashback 종류
- 사용자의 논리적인 오류를 빠르게 복구해 낼 수 있는 방법
- 논리적인 장애라고 할지라도 flashback 기능으로 복구 할 수 없는 경우가 많음
- 물리적인 장애는 복구할 수 없음
- 9i 버전부터 등장했으나 10g 버전부터 여러가지 기능을 추가로 지원하여 획기적인 기능이 됨

## Flashback 명령어

Flashback 명령어는 크게 3가지로 구분된다.

1. Row Level Flashback
2. Table Level Flashback
   - Drop Table 복구하기 (휴지통 활용)
   - Recyclebin 관리하기
3. Database Level Flashback
   - TRUNCATE TABLE 장애 복구하기 (Flashback Database 사용)

### Flashback Data Archive (11g New Feature)
- Flashback Data Archive 활성화
- Flashback Database Archive 사용하기
  - FDA를 사용하는 테이블 삭제하기
  - Flashback History Table 조회하기
- Flashback 명령어의 주의사항

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

## Undo Segment

Flashback 명령어는 3가지 (Row Level Flashback, Table Level Flashback, Database Level Flashback)로 구분된다.

## 1. Row Level Flashback

- 특정 테이블의 특정 Row만 Flashback
- Undo data의 정보를 이용해서 복구 (Undo Segment)
- flashback 기능은 commit된 데이터만 복구 가능

```sql
create table member 
(name varchar2(10),
address varchar2(10),
tel varchar2(15));

insert into member values('Park', 'Incheon', 111);
insert into member values('Kim', 'Gasan', 222);
insert into member values('Lee', 'Earth', 333);
commit;

SQL> select * from member;

NAME       ADDRESS    TEL
---------- ---------- ---------------
Park       Incheon    111
Kim        Gasan      222
Lee        Earth      333

update member
set name = 'Hong'
where name = 'Park';
commit;

update member
set name = 'Lee'
where name = 'Kim';
commit;
...

SQL> select * from member;

NAME       ADDRESS    TEL
---------- ---------- ---------------
Hong       Incheon    111
Lee        Gasan      222
Lee        Earth      333
```

이전 데이터를 모른다고 가정하고 고객이 Hong을 원래 데이터로 복구해 달라고 한다면 난감할 것이다. 이때 해당 데이터의 과거 변경 이력을 전부 찾아주는 쿼리(Flashback Version Query)를 사용한다.

```sql
select versions_startscn st_scn, versions_endscn endscn,
versions_xid txid, versions_operation opt, name 
from member versions between scn minvalue and maxvalue
where tel=111;

    ST_SCN     ENDSCN TXID             O NAME
---------- ---------- ---------------- - ----------
   2898078            1A00120078020000 U Hong
   2898064    2898078 1600050070020000 U Park
              2898064                    Hong
```

- → 하나의 Row에 여러 사람이 DML을 발생 시킨 경우 해당 변경사항이 발생한 시간으로 짐작 가능
- → `scn_to_timestamp()` 함수 사용

```sql
SQL> select scn_to_timestamp(2898064) from dual;

SCN_TO_TIMESTAMP(2898064)
---------------------------------------------------------------------------
13-JUL-26 03.09.22.000000000 AM
```

⇒ SCN을 시간으로 변경해서 조회 시 대략적으로 원하는 SCN과 변경사항을 찾아낼 수 있음
⇒ 변경 사항을 찾은 뒤 Transaction Query를 수행해서 원래 데이터로 되돌림
⇒ Transaction Query는 복잡해서 변경 내역을 찾은 후 원래 데이터로 update

## 2. Table Level Flashback

- Row Level Flashback과는 달리 장애 난 테이블 전체의 내용을 변경
- 특정 테이블에 DML 에러 발생 시, 특정 테이블이 DROP TABLE 되었을 때 사용하는 방법 각각 2가지

### [DML 에러 복구법]

```sql
ORA-08185: Flashback not supported for user SYS 
SQL> conn test/test
Connected.

SQL> alter table test.ibgo enable row movement;
Table altered.

create table ibgo
(I_CODE varchar2(15),
I_NAME varchar2(15),
QTY varchar2(15));

insert into ibgo values(100,'aa',100);
insert into ibgo values(101,'ab',50);
insert into ibgo values(102,'ac',20);

select * from ibgo;
I_CODE          I_NAME          QTY
--------------- --------------- ---------------
100             aa              100
101             ab              50
102             bb              20

update ibgo
set I_NAME='ba'
where I_CODE=102;
commit;

select * from ibgo;
I_CODE          I_NAME          QTY
--------------- --------------- ---------------
100             aa              100
101             ab              50
102             ba              20

SQL> delete from ibgo where I_CODE=102;
1 row deleted.

SQL> commit;
Commit complete.

SQL> select * from ibgo;

I_CODE          I_NAME          QTY
--------------- --------------- ---------------
100             aa              100
101             ab              50
102             bb              20

SQL> flashback table ibgo to timestamp(systimestamp-interval '10' minute);

Flashback complete.

SQL> select * from ibgo;

I_CODE          I_NAME          QTY
--------------- --------------- ---------------
100             aa              100
101             ab              50
102             bb              20
```

→ interval 뒤의 시간은 분(minute), 초(second) 모두 가능

### [Drop Table 복구하기 - 휴지통 활용]

- drop table 시 휴지통으로 들어가서 보관되다가 flashback으로 간단히 복구
- 오라클에서는 10g부터 휴지통 기능이 등장해서 테이블을 지우게 되면 휴지통으로 옮겨지게 됨

```sql
SQL> col TNAME for a20
SQL> select * from tab;

TNAME                TABTYPE        CLUSTERID
-------------------- ------------- ----------
IBGO                 TABLE
SYS_TEMP_FBT         TABLE

SQL> drop table ibgo;

Table dropped.

SQL> select * from tab;

TNAME                TABTYPE        CLUSTERID
-------------------- ------------- ----------
SYS_TEMP_FBT         TABLE
BIN$Voh/bAb5Cb3gZXye TABLE
xlyhWQ==$0

SQL> show recyclebin
ORIGINAL NAME    RECYCLEBIN NAME                OBJECT TYPE  DROP TIME
---------------- ------------------------------ ------------ -------------------
IBGO             BIN$Voh/bAb5Cb3gZXyexlyhWQ==$0 TABLE        2026-07-13:20:43:38

SQL> flashback table ibgo to before drop;

Flashback complete.

SQL> select * from tab;

TNAME                TABTYPE        CLUSTERID
-------------------- ------------- ----------
IBGO                 TABLE
SYS_TEMP_FBT         TABLE

SQL> show recyclebin;
SQL>
```

### Recyclebin 관리하기

## 3. Database Level Flashback

- DB 전체를 과거의 특정 시점으로 돌림 (불완전 복구와 비슷한 개념)
- 불완전 복구에 비해 속도가 빠르고 방법도 간단
- 전통적인 복구방식: 장애 발생 시 백업된 데이터파일을 복원하여 리두로그/아카이브로그를 적용시켜 복구
- Flashback Database 방식: 장애 난 데이터파일에 Flashback log를 적용시켜 복구
  - → 필요할 경우 Redo log 사용 (다만 백업 파일 복원 시 시간이 안 걸리기 때문에 빨리 복구 가능한 것)
  - → 기존 방식의 redo log와 archive log 대신에 flashback log라는 것을 주로 사용

### [flashback database 명령어 사용 가능 조건]

- Flashback database 명령어로만 복구해야만 하는 대표적인 장애는 drop user, truncate user 장애
- flashback log에 대한 설정이 먼저 되어 있어야 함
  - DB 아카이브 모드
  - Flashback Database mode로 설정
- → flashback version Query / transaction Query와 flashback table 명령어는 별도 설정 없이 오라클 10g 버전부터 가능

### [환경 설정]

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

### [flashback log]

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

### [TRUNCATE TABLE 장애 복구하기 (Flashback Database 사용)]

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

## Flashback Data Archive (11g New Feature)

- undo segment에 있는 commit된 내용을 특정 테이블스페이스에 archive하여 영구적으로 저장하는 기능 제공
- FBDA 프로세스는 undo segment의 내용을 비정기적으로 특정 TBS에 저장
  - → FBDA 백그라운드 프로세스가 비정기적으로 undo segment의 내용을 archive 해서 flashback data archive 기능을 구현

### [특징]

- 이 기능이 활성화되면 FBDA가 Undo Segment의 내용을 모두 기록하기 전에는 해당 Undo Segment는 재활용되지 않음
- 대량 DML이 발생할 경우 병목 현상이 생길 우려가 있어 최대 10개까지의 FBDA 백그라운드 프로세스가 동시에 작업
- FBDA 프로세스는 늘 활성화되어 있는 것이 아니라 sleep 하고 있다가 특정 시간이 되면 자동으로 활성화되어 undo segment 내용을 저장
  - → undo량이 많이 발생할 경우에는 자주 내려 쓰게 되며 기본값은 5분으로 설정
- 해당 데이터는 자동으로 파티셔닝되어 저장되며 관리자라도 그 내용을 변경할 수 없음
- Retention time을 설정하여 데이터를 관리하며 retention time이 지난 데이터는 자동으로 삭제
- Insert되는 데이터는 이 기능을 사용하지 않음

## Flashback Data Archive 활성화

1. Flashback history table을 저장할 TBS를 생성
2. Flashback data archive를 관리할 관리자 계정을 생성
3. 관리자 계정에 권한을 할당
4. 관리자 계정으로 로그인 한 후 flashback history table을 생성

### Flashback history table을 저장할 TBS를 생성

```sql
SQL> 
create tablespace ts_fda01
datafile '/oracle2/base/oradata/GD2/ts_fda01.dbf' size 5M; 

Tablespace created.

SQL> set linesize 200
SQL> r
  1  select tablespace_name, bytes/1024/1024 MB, file_name
  2* from dba_data_files

TABLESPACE_NAME              MB FILE_NAME
-------------------- ---------- ------------------------------------------------------------
SYSTEM                      910 /oracle2/base/oradata/GD2/system01.dbf
SYSAUX                      910 /oracle2/base/oradata/GD2/sysaux01.dbf
USERS                         5 /oracle2/base/oradata/GD2/users02.dbf
USERS                         5 /oracle2/base/oradata/GD2/users01.dbf
TBLSPACE1                   100 /oracle2/base/oradata/GD2/tblspace1_01.dbf
TBLSPACE1                   200 /oracle2/base/oradata/GD2/test1_tbs1.dbf
UNDO_TBS1                  1024 /oracle2/base/oradata/GD2/undo_tbs1_01.dbf
BIG_TBS1                   1024 /oracle2/base/oradata/GD2/big1_01.dbf
UNDOTBS2                    500 /oracle2/base/oradata/GD2/undotbs2.dbf
TTS01                         4 /oracle2/base/oradata/GD2/tts01.dbf
TTS02                         4 /oracle2/base/oradata/GD2/tts02.dbf

TABLESPACE_NAME              MB FILE_NAME
-------------------- ---------- ------------------------------------------------------------
TS_FDA01                      5 /oracle2/base/oradata/GD2/ts_fda01.dbf

12 rows selected.
```

### Flashback data archive를 관리할 관리자 계정을 생성 및 권한 할당

```sql
SQL> create user fbadmin identified by pbpwd
default tablespace ts_fda01;  

User created.

SQL> grant resource, connect to fbadmin;

Grant succeeded.

SQL> grant flashback archive administer to fbadmin;

Grant succeeded.
```

flashback archive administer 권한은 11g부터 생긴 권한

### 관리자 계정 로그인 후 flashback history table 생성

```sql
SQL> conn / as sysdba
Connected.

SQL> alter user fbadmin quota 1G on ts_fda01;

User altered.

SQL> conn fbadmin/pbpwd
Connected.

SQL> create flashback archive fda01
  2  tablespace ts_fda01
  3  quota 100m
  4  retention 30 DAY;

Flashback archive created.
```

현재 만들어져 있는 Flashback history table 조회

```sql
SQL> col FLASHBACK_ARCHIVE_NAME for a30
SQL> R
  1  select owner_name, flashback_archive_name, retention_in_days, status
  2* from dba_flashback_archive

OWNER_NAME                     FLASHBACK_ARCHIVE_NAME         RETENTION_IN_DAYS STATUS
------------------------------ ------------------------------ ----------------- -------
FBADMIN                        FDA01                                         30
```

## Flashback Database Archive 사용하기

Flashback 기능 중 일부는 undo data를 사용하기 때문에 Flashback Data Archive를 사용하지 않게 되면 데이터를 복구할 수 없게 됨.

undo 상태 확인

```sql
SQL> show parameter undo;

NAME                                 TYPE        VALUE
------------------------------------ ----------- ------------------------------
temp_undo_enabled                    boolean     FALSE
undo_management                      string      AUTO
undo_retention                       integer     900
undo_tablespace                      string      UNDOTBS2
```

flashback data archive 상태 확인

```sql
SQL> col owner_name for a10
SQL> col flashback_archive_name for a10
SQL> col retention_in_days for 999
SQL> col status for a10
SQL> set line 200
SQL> select owner_name, flashback_archive_name, retention_in_days, status from dba_flashback_archive;

OWNER_NAME FLASHBACK_ RETENTION_IN_DAYS STATUS
---------- ---------- ----------------- ----------
FBADMIN    FDA01                     30
```

권한 부여

```sql
SQL> conn / as sysdba
Connected.

SQL> grant flashback archive on fda01 to fbadmin;

Grant succeeded.
```

fbadmin 사용자로 test4 테이블을 생성하며 FDA를 FDA01을 사용하도록 설정

```sql
SQL> create table test4(no number, name varchar2(10)) flashback archive fda01;

Table created.

SQL> insert into test4 values(1,'AAA');
1 row created.

SQL> insert into test4 values(2,'BBB');
1 row created.

SQL> insert into test4 values(3,'CCC');
1 row created.

SQL> commit;
Commit complete.

SQL> select * from test3;

        NO NAME
---------- ----------
         1 AAA
         2 BBB
         3 CCC
```

update 장애 발생

```sql
SQL> select * from test3;

        NO NAME
---------- ----------
         1 AAA
         2 BBB
         3 CCC

SQL> update test3 set name = 'DDD';

3 rows updated.

SQL> select * from test3;

        NO NAME
---------- ----------
         1 DDD
         2 DDD
         3 D
```

FBADMIN 유저가 사용하는 UNDO_SEGMENT 조회 (→ `_SYSSMU26_2729696447$`)

```sql
SQL> ! cat roll.sql
set line 200
select s.sid, s.serial#, s.username, r.name "ROLLBACK SEG"
from v$session s, v$transaction t, v$rollname r
where s.taddr=t.addr and t.xidusn=r.usn
/

SQL> @roll

       SID    SERIAL# USERNAME                                           ROLLBACK SEG
---------- ---------- -------------------------------------------------- ------------------------------
        10      11923 FBADMIN                                            _SYSSMU26_2729696447$

SQL> commit;
```

userb 유저 생성 및 권한 부여 (→ 데이터 저장하려면 권한뿐만 아니라 저장 공간 QUOTA도 필요)

```sql
SQL> 
create user userb identified by userb
default tablespace ts_fda01;   

User created.

SQL> grant resource, connect to userb;

Grant succeeded.

SQL> grant flashback archive on fda01 to userb;

Grant succeeded.

SQL> ALTER USER userb QUOTA 500M ON ts_fda01;

User altered.

SQL> grant select on v_$session to userb;

Grant succeeded.

SQL> grant select on v_$transaction to userb;

Grant succeeded.

SQL> grant select on v_$rollname to userb;

Grant succeeded.
```

Userb 계정으로 test04 생성 후 undo segment를 덮어쓰게 만듦

```sql
SQL> 
begin
for i in 1..1000 loop
        insert into test04 values (i, 'No name~!');
end loop;
end ;
/ 

PL/SQL procedure successfully completed.
```

→ @roll 진행해서 undo segment가 꼭 재사용하진 않음

```sql
SQL> col USERNAME for a50
SQL> r
  1  select s.sid, s.serial#, s.username, r.name "ROLLBACK SEG"
  2  from v$session s, v$transaction t, v$rollname r
  3* where s.taddr=t.addr and t.xidusn=r.usn

       SID    SERIAL# USERNAME                                           ROLLBACK SEG
---------- ---------- -------------------------------------------------- ------------------------------
       144      28811 USERB                                              _SYSSMU28_3509487641$
```

flashback data archive 기능을 사용하면 이전 버전에서는 복구가 되지 않았던 undo segment 덮어쓴 내용까지 복구가 되는 것을 확인 가능함.

### [FDA를 사용하는 테이블 삭제하기]

→ Flashback data archive 기능을 사용하는 테이블을 삭제할 경우에는 flashback data archive 기능 때문에 정상적으로 지워지지 않음.

```sql
SQL> drop table test3;
drop table test3
           *
ERROR at line 1:
ORA-55610: Invalid DDL statement on history-tracked table

SQL> alter table test3 no flashback archive;

Table altered.

SQL> drop table test3;

Table dropped.
```

### [flash back history table 조회하기]

```sql
SQL> col table_name for a10
col flashback_archive_name for a10
col archive_table_name for a20
col status for a10
select * from dba_flashback_archive_tables;

TABLE_NAME OWNER_NAME FLASHBACK_ ARCHIVE_TABLE_NAME   STATUS
---------- ---------- ---------- -------------------- ----------
TEST4      FBADMIN    FDA01      SYS_FBA_HIST_74639   ENABLE
```

### [Flashback 명령어의 주의사항]

- 물리적인 장애 - 파일 (data file, redo log file, control file)이 삭제된 경우
- System TBS에 있던 테이블이 삭제되면 flashback table to before drop 안됨.
- Control file을 재생성하면 Flashback database 명령어를 사용할 수 없음.
- TBS가 drop되면 Flashback 명령어로 복구 안됨.
- Data file이 shrunk 되면 Flashback database 명령어로 복구 안됨.
- Alter table로 테이블 구조가 변경되면 Version query로 복구 안됨.
- System tables과 통계정보는 Flashback 명령어로 복구 안됨.
- Purge된 테이블은 flashback 명령어로 복구 안됨.
- 테이블과 별도로 삭제된 인덱스는 복구 안됨.
- Mview 복구 안됨.
