---
title: "Row Level Flashback"
tags:
    - Oracle
    - Flashback
date: "2026-08-21"
layout: single
categories:
  - Oracle
  - Flashback
permalink: /Oracle/Flashback/02-row-level.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

← [Flashback 개요](/Oracle/Flashback/01-overview.html)

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

---

다음: [Table Level Flashback](/Oracle/Flashback/03-table-level.html)
