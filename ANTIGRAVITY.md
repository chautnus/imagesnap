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

**Last updated**: 2026-04-30 11:15
**Last session by**: Antigravity
**Current sprint focus**: Đồng bộ hóa tài liệu và hoàn thiện nhất quán PWA/Extension.

---

## Context tóm tắt

### Đang làm gì?
Đã hoàn thành rà soát tài liệu (Docs Audit), đồng bộ BUGLOG và thống nhất metadata giữa Web Application (PWA) và Browser Extension.

### Đã làm gì trong phiên trước?
- **Đồng bộ BUGLOG.md**: Cập nhật 5 lỗi quan trọng (BUG-004 đến BUG-008) liên quan đến CSP Login, Camera, và Mobile UI.
- **Nhất quán Metadata**: Thống nhất tên sản phẩm là `ImageSnap: Ecommerce Asset Collector` và mô tả đồng bộ trên cả PWA và Extension.
- **Sửa lỗi PWA**: Fix lỗi `apple-touch-icon` trỏ ra ngoài, tuân thủ nguyên tắc không dùng remotely hosted code [BR-5.1.1].
- **Fix Bug [BUG-003]**: Sửa lỗi crash màn hình đen khi tạo Category mới trên Capture Tab.

### Dừng ở đâu?
- Hệ thống tài liệu (Docs Ecosystem) đã đạt trạng thái đồng bộ v2.2.
- Metadata và Branding đã nhất quán giữa các platform.
- Các lỗi crash nghiêm trọng đã được fix và log lại.

---

## Open Items cần attention

```
[x] [DEV-2026W18-16] Đồng bộ BUGLOG.md → COMPLETED.
[x] [DEV-2026W18-17] Nhất quán Metadata PWA/Extension → COMPLETED.
[ ] [DEV-2026W18-18] Triển khai Admin Dashboard UI (Visual user management).
[ ] [DEV-2026W18-19] Expand Playwright tests (Capture & Data flows).
[ ] [DEV-2026W18-20] Verify Payment Live Mode (Lemon Squeezy).
```

---

## Tech context quan trọng

### Dependency versions (critical)
```
node:     >=18.0.0
vite:     ^6.2.0
react:    ^19.0.0
express:  ^4.21.2
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
