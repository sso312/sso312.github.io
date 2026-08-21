---
title: "file:///mnt/cdrom/repodata/repomd.xml: [Errno 14] curl#37 - Couldn't open file"
tags:
    - Oracle
    - Linux
    - yum
    - 설치
date: "2026-06-17"
---

## 상황
yum repo 등록 중 발생.

## 원인
`/mnt/cdrom`에 ISO가 제대로 마운트되지 않음.

## 해결
```bash
[root@psh yum.repos.d]# ls -l /mnt/cdrom
ls: cannot access /mnt/cdrom: 그런 파일이나 디렉터리가 없습니다
[root@psh yum.repos.d]# lsblk
NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda                 8:0    0  100G  0 disk
├─sda1              8:1    0    1G  0 part /boot
└─sda2              8:2    0   99G  0 part
  ├─rhel_psh-root 253:0    0   89G  0 lvm  /
  └─rhel_psh-swap 253:1    0   10G  0 lvm  [SWAP]
sr0                11:0    1  4.2G  0 rom
[root@psh yum.repos.d]# mkdir -p /mnt/cdrom
[root@psh yum.repos.d]# mount /dev/sr0 /mnt/cdrom
mount: /dev/sr0 is write-protected, mounting read-only
[root@psh yum.repos.d]# ls -l /mnt/cdrom
합계 974
dr-xr-xr-x. 3 root root   2048  7월 23  2019 EFI
-r--r--r--. 1 root root   8266  7월 23  2019 EULA
-r--r--r--. 1 root root  18092  7월 23  2019 GPL
dr-xr-xr-x. 2 root root   2048  7월 23  2019 LiveOS
dr-xr-xr-x. 2 root root 946176  7월 23  2019 Packages
-r--r--r--. 1 root root   3375  7월  3  2019 RPM-GPG-KEY-redhat-beta
-r--r--r--. 1 root root   3211  7월  3  2019 RPM-GPG-KEY-redhat-release
-r--r--r--. 1 root root   1796  7월 23  2019 TRANS.TBL
dr-xr-xr-x. 4 root root   2048  7월 23  2019 addons
-r--r--r--. 1 root root   1455  7월 23  2019 extra_files.json
dr-xr-xr-x. 3 root root   2048  7월 23  2019 images
dr-xr-xr-x. 2 root root   2048  7월 23  2019 isolinux
-r--r--r--. 1 root root    114  7월 23  2019 media.repo
dr-xr-xr-x. 2 root root   2048  7월 23  2019 repodata
```
