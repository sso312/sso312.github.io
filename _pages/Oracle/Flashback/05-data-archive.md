---
title: "Flashback Data Archive (11g New Feature)"
tags:
    - Oracle
    - Flashback
date: "2026-08-21"
---

← [Flashback 개요](/Oracle/Flashback/01-overview.html)

- undo segment에 있는 commit된 내용을 특정 테이블스페이스에 archive하여 영구적으로 저장하는 기능 제공
- FBDA 프로세스는 undo segment의 내용을 비정기적으로 특정 TBS에 저장
  - → FBDA 백그라운드 프로세스가 비정기적으로 undo segment의 내용을 archive 해서 flashback data archive 기능을 구현

## [특징]

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

## [FDA를 사용하는 테이블 삭제하기]

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

## [flash back history table 조회하기]

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

## [Flashback 명령어의 주의사항]

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
