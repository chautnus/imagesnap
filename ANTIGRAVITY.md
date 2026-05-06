# ANTIGRAVITY.md — SESSION CONTEXT FILE
> File này là "bộ nhớ ngắn hạn" giữa các phiên làm việc.
> Agent PHẢI đọc file này đầu tiên (BOOT-01).
> Agent PHẢI cập nhật cuối mỗi phiên (/sync).

---

## Thông tin dự án
- **Project Name**: ImageSnap
- **Official Domain**: [www.imagesnap.cloud](https://www.imagesnap.cloud)
- **Status**: Active / Production Ready
- **Core Architecture**: Centralized Storage (Staff-to-Admin Proxy)

## 🚀 Key Features
- **Centralized Storage**: Staff saves directly to Admin's Drive/Sheets.
- **Admin Dashboard**: Manage users, categories, and master workspace.
- **Automated Testing**: Playwright suite for E2E reliability.

---

## Trạng thái hiện tại

**Last updated**: 2026-05-06 03:00
**Last session by**: Antigravity
**Current sprint focus**: Triển khai Persistence Layer (PostgreSQL) và tối ưu hóa hệ thống xác thực.

---

## Context tóm tắt

### Đang làm gì?
Đã hoàn thành việc di chuyển toàn bộ hệ thống lưu trữ người dùng từ file JSON sang **PostgreSQL** để đảm bảo dữ liệu không bị mất khi deploy trên Railway. Đã đồng bộ phiên bản dự án lên **v1.3.4**.

### Đã làm gì trong phiên trước?
- **PostgreSQL Migration**: Chuyển đổi storage từ `user_db.json` sang PostgreSQL. Cập nhật `server.ts` và `db.ts` sang mô hình async.
- **Fix Bug [BUG-012]**: Sửa lỗi không gõ được dấu phẩy khi tạo Options cho trường 'select'.
- **Fix Bug [BUG-013]**: Giải quyết triệt để vấn đề mất dữ liệu người dùng/usage count mỗi khi Railway restart.
- **Lock Extension ID**: Thêm `"key"` vào `manifest.json` để ID extension không bao giờ thay đổi, fix lỗi OAuth redirect.
- **Đồng bộ phiên bản**: Cập nhật toàn bộ hệ thống lên bản **v1.3.4** và rà soát lại các tài liệu dự án (BUGLOG, DEVLOG, ARCH).

### Dừng ở đâu?
- Hệ thống đã có database bền vững.
- Extension ID đã cố định, sẵn sàng cấu hình vĩnh viễn trên Google Cloud.
- Toàn bộ tài liệu dự án đã được cập nhật đến phiên bản v1.3.4.

---

## Open Items cần attention

```
[x] [DEV-2026W19-01] PostgreSQL Migration → COMPLETED.
[x] [DEV-2026W19-02] Fix Select Comma Bug → COMPLETED.
[x] [DEV-2026W19-03] Unified Versioning v1.3.4 → COMPLETED.
[ ] [DEV-2026W19-04] Auto-Silent Login implementation.
[ ] [DEV-2026W19-05] Expand Playwright tests for PostgreSQL flow.
```

---

## Tech context quan trọng

### Dependency versions (critical)
```
node:     >=18.0.0
vite:     ^6.2.0
react:    ^19.0.0
express:  ^4.21.2
pg:       ^8.11.0 (PostgreSQL client)
```

### Environment notes
- Dự án là một Browser Extension kết hợp React PWA.
- Server chạy Express, tích hợp Lemon Squeezy cho payment.

### Recent ARCH decisions (7 ngày)
- [DEV-2026W18-17] Thống nhất branding: `ImageSnap: Ecommerce Asset Collector`.
- [DEV-2026W18-16] Chuẩn hóa Lesson Learned format trong BUGLOG.

---

## Known gotchas / Cảnh báo

- ⚠ [PAT-IMPORT-001]: Luôn xuất lại import block đầy đủ khi thêm symbol mới vào file hiện có. Chạy `tsc --noEmit` để xác minh.
- ⚠ [BUG-007]: Tránh dùng `h-screen` cho mobile UI, ưu tiên `fixed inset-0` và `min-h-0`.

---

## Agent notes (phiên này để lại cho phiên sau)

- Metadata đã nhất quán, nhưng cần kiểm tra xem Store Assets (screenshots, v.v.) có cần cập nhật theo tên mới không.
- Bắt đầu phiên sau bằng việc `/plan` cho Admin Dashboard UI (BR-2.3).
