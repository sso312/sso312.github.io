---
title: "-bash: unzip: command not found (repo 등록 후 설치)"
tags:
    - Oracle
    - Linux
    - 설치
    - yum
date: "2026-06-12"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/11-unzip-not-found-1.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

## 문제 (enabled repo가 없으면 현재 상태에서는 아래 명령이 실패)
```bash
[oracle@sso2 ~]$ unzip -q /home/oracle/linuxx64_12201_database.zip
-bash: unzip: command not found
```

```bash
[root@sso2 ~]# yum install -y unzip
Loaded plugins: product-id, search-disabled-repos, subscription-manager
This system is not registered with an entitlement server. You can use subscription-manager to register.
There are no enabled repos.
 Run "yum repolist all" to see the repos you have.
 To enable Red Hat Subscription Management repositories:
     subscription-manager repos --enable <repo>
 To enable custom repositories:
     yum-config-manager --enable <repo>
```

## 해결

ISO를 로컬 repo로 등록해서 offline yum 설치를 진행한다.

```bash
[root@sso2 ~]# cd /mnt
[root@sso2 mnt]# ll
total 974
dr-xr-xr-x. 4 root root   2048 Jul 23  2019 addons
dr-xr-xr-x. 3 root root   2048 Jul 23  2019 EFI
-r--r--r--. 1 root root   8266 Jul 23  2019 EULA
-r--r--r--. 1 root root   1455 Jul 23  2019 extra_files.json
-r--r--r--. 1 root root  18092 Jul 23  2019 GPL
dr-xr-xr-x. 3 root root   2048 Jul 23  2019 images
dr-xr-xr-x. 2 root root   2048 Jul 23  2019 isolinux
dr-xr-xr-x. 2 root root   2048 Jul 23  2019 LiveOS
-r--r--r--. 1 root root    114 Jul 23  2019 media.repo
dr-xr-xr-x. 2 root root 946176 Jul 23  2019 Packages
dr-xr-xr-x. 2 root root   2048 Jul 23  2019 repodata
-r--r--r--. 1 root root   3375 Jul  3  2019 RPM-GPG-KEY-redhat-beta
-r--r--r--. 1 root root   3211 Jul  3  2019 RPM-GPG-KEY-redhat-release
-r--r--r--. 1 root root   1796 Jul 23  2019 TRANS.TBL
[root@sso2 mnt]# mkdir /repo
[root@sso2 mnt]# cp -arp * /repo
[root@sso2 mnt]# cd /etc/yum.repos.d/
[root@sso2 yum.repos.d]# vi redhat.repo
[root@sso2 yum.repos.d]# yum clean all
[root@sso2 yum.repos.d]# yum makecache
[root@sso2 yum.repos.d]# yum repolist
repo id                               repo name                            status
local                                 local                                5,229
repolist: 5,229

[oracle@sso2 ~]$ su -
Password:
[root@sso2 ~]# yum install -y unzip
```
