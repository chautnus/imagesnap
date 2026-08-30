---
name: edit-data-record-arch
description: Architecture decisions cho feature F-003 Sửa thông tin record trong Data
metadata:
  type: project
---

Feature: F-003 edit-data-record
Pattern: Mirror pattern Category-edit — dùng updateRowBySearch() có sẵn cho Product update.
ADR-002 (2026-08-29): Product edit dùng updateRowBySearch, mirror pattern Category — chọn thay vì soft-update/append-flag hoặc endpoint độc lập, vì codebase đã có pattern y hệt ổn định cho Category. Trade-off chấp nhận: full-column scan để tìm ID, không xử lý concurrency.
