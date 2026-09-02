---
title: "failure: repodata/repomd.xml from base: [Errno 256] No more mirrors to try."
tags:
    - Oracle
    - Linux
    - yum
    - 설치
date: "2026-06-17"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/18-no-more-mirrors.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

## 원인
repo 경로가 꼬임 (외부 미러 접근 불가 + 로컬 repo와 충돌).

```bash
[root@psh yum.repos.d]# yum install -y bc
Loaded plugins: langpacks, product-id, search-disabled-repos, subscription-manager
This system is not registered with an entitlement server. You can use subscription-manager to register.
http://ftp.daum.net/centos/7/os/x86_64/repodata/repomd.xml: [Errno 14] curl#6 - "Could not resolve host: ftp.daum.net; 알 수 없는 오류"
Trying other mirror.

 One of the configured repositories failed (CentOS-7Server - Base),
 and yum doesn't have enough cached data to continue. At this point the only
 safe thing yum can do is fail. There are a few ways to work "fix" this:

     1. Contact the upstream for the repository and get them to fix the problem.
     2. Reconfigure the baseurl/etc. for the repository, to point to a working upstream.
     3. Run the command with the repository temporarily disabled
            yum --disablerepo=base ...
     4. Disable the repository permanently:
            yum-config-manager --disable base
        or
            subscription-manager repos --disable=base
     5. Configure the failing repository to be skipped, if it is unavailable:
            yum-config-manager --save --setopt=base.skip_if_unavailable=true

failure: repodata/repomd.xml from base: [Errno 256] No more mirrors to try.
http://ftp.daum.net/centos/7/os/x86_64/repodata/repomd.xml: [Errno 14] curl#6 - "Could not resolve host: ftp.daum.net; 알 수 없는 오류"
```

```bash
[root@psh yum.repos.d]# pwd
/etc/yum.repos.d
[root@psh yum.repos.d]# ll
합계 4
-rw-r--r--. 1 root root 420  6월 17 10:35 redhat.repo

[root@psh yum.repos.d]# cat redhat.repo

[local]
name=local
baseurl=file:///repo
enabled=1
gpgcheck=0
```
