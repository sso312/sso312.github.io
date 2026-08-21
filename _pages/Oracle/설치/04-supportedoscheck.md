---
title: "[Oracle 19c] supportedOSCheck 오류"
tags:
    - Oracle
    - 19c
    - 설치
date: "2026-05-27"
---

## 발생 상황
- 작업 일자: 2026-05-27
- 서버 명: sso1
- 사용자: oracle
- 작업 위치: `(GD)[oracle@sso1 /oracle/base/19c]$`
- 작업 목적: 오라클 엔진 설치

## 실행한 명령어
```bash
./runInstaller
```

## 발생한 에러 메시지
```
[INS-08101] Unexpected error while executing the action at state: 'supportedOSCheck'
```

## 원인 분석
- 어떤 명령어에서 발생했는지: runInstaller 실행 중
- 에러의 핵심 키워드: supportedOSCheck
- 원인: 현재 OS 버전 확인하다가 실패

## 해결 방법
```bash
# oracle 계정 터미널에서 OS 확인
cat /etc/os-release

# Oracle 19c 설치 시 OS를 OL7처럼 인식하게 환경변수 설정
export CV_ASSUME_DISTID=OL7

# 설정 확인
echo $CV_ASSUME_DISTID

# ORACLE_HOME으로 이동
cd $ORACLE_HOME

# runInstaller 다시 실행
./runInstaller
```

## 최종 정리
- 문제: 설치 프로그램이 해당 OS에 설치 가능한지 확인에서 멈춤
- 원인: Oracle 설치 프로그램의 OS 버전 체크 오류
- 해결: OS를 OL7처럼 인식하게 환경변수 설정
- 재발 방지: 설치 프로그램이 OS 체크 시 현재 OS를 OL7 계열처럼 보도록 `.bash_profile` 맨 아래 `export CV_ASSUME_DISTID=OL7` 추가

```bash
(GD)[oracle@sso1 /oracle/base/19c]$ vi ~/.bash_profile
(GD)[oracle@sso1 /oracle/base/19c]$ source ~/.bash_profile
(GD)[oracle@sso1 /oracle/base/19c]$ echo $CV_ASSUME_DISTID
OL7
```
