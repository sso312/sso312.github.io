---
title: "[Oracle 19c] runInstaller 실행 시 libnsl.so.1 에러"
tags:
    - Oracle
    - 19c
    - 설치
    - Linux
date: "2026-05-27"
---

## 발생 상황
- 작업 일자: 2026-05-27
- 서버 명: sso1
- 사용자: oracle
- 작업 위치: /oracle/base/19c
- 작업 목적: Oracle 19c runInstaller 실행

## 실행한 명령어
```bash
(GD)[oracle@sso1 /oracle/base/19c]$ ./runInstaller
```

## 발생한 에러 메시지
```
/oracle/base/19c/perl/bin/perl: error while loading shared libraries: libnsl.so.1: cannot open shared object file: No such file or directory
```

## 원인 분석
- 어떤 명령어에서 발생했는지: runInstaller 실행 중 Perl 실행 단계에서 오류 발생
- 에러의 핵심 키워드: libnsl.so.1 파일 없음
- 원인: OS에 Oracle 설치에 필요한 libnsl 라이브러리 패키지가 설치 안 돼 있음
- 관련 파일/패키지/서비스: Oracle 설치 파일 문제가 아니라 OS 필수 패키지 누락 문제

## 해결 방법
```bash
su - root
yum install -y libnsl
rpm -q libnsl
ldconfig -p | grep libnsl
su - oracle
cd $ORACLE_HOME
./runInstaller
```

## 최종 정리
- 문제: runInstaller 실행 시 libnsl.so.1 라이브러리 없음
- 원인: libnsl 패키지 미설치
- 해결: root 계정에서 `yum install -y libnsl` 설치
- 재발 방지: Oracle 설치 전 필수 패키지 목록 사전 설치 확인
