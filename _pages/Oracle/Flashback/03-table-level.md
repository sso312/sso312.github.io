---
title: "Table Level Flashback"
tags:
    - Oracle
    - Flashback
date: "2026-08-21"
---

← [Flashback 개요](/Oracle/Flashback/01-overview.html)

- Row Level Flashback과는 달리 장애 난 테이블 전체의 내용을 변경
- 특정 테이블에 DML 에러 발생 시, 특정 테이블이 DROP TABLE 되었을 때 사용하는 방법 각각 2가지

## [DML 에러 복구법]

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

## [Drop Table 복구하기 - 휴지통 활용]

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

## Recyclebin 관리하기

Drop 된 객체는 recyclebin에서 관리되며, 필요 시 `purge`로 완전히 비우거나 `show recyclebin` / `flashback table ... to before drop`으로 복구할 수 있다.

---

다음: [Database Level Flashback](/Oracle/Flashback/04-database-level.html)
