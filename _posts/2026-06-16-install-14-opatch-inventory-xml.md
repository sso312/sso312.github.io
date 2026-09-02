---
title: "PatchMetadataLoadingException: Failed to read inventory.xml file"
tags:
    - Oracle
    - OPatch
    - 설치
date: "2026-06-16"
layout: single
categories:
  - Oracle
  - 설치
permalink: /Oracle/설치/14-opatch-inventory-xml.html
comments: false
author_profile: true
sidebar:
  nav: "categories"
---

OPatch 단계에서 rollback 중 Oracle Inventory 정보를 읽다가 실패한 상황.

```
User Responded with: Y
RollbackSession removing interim patch '39034528' from inventory
UtilSession failed: RollbackSession failed in system modification phase... 'oracle.glcm.opatch.common.api.PatchMetadataLoadingException: Failed to read inventory.xml file'
Log file location: /oracle2/base/19c/cfgtoollogs/opatch/opatch2026-06-16_04-38-00AM_1.log
```

## 해결
inventory 위치, 권한, 파일 상태를 확인한다.

```bash
chmod -R g+rw /oracle2/oraInventory
```
