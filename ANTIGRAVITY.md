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

**Last updated**: 2026-05-06 04:30
**Last session by**: Antigravity
**Current sprint focus**: Hoàn thiện hệ thống xác thực v1.3.5 và bắt đầu Admin Dashboard.

---

## Context tóm tắt

### Đang làm gì?
Đã hoàn thành việc khắc phục triệt để lỗi đăng nhập (OAuth 400) và lỗi quyền truy cập nội dung trang web. Toàn bộ hệ thống đã được đồng bộ lên phiên bản **v1.3.5** với tên gọi mới.

### Đã làm gì trong phiên trước?
- **Fix Auth & Permissions (v1.3.5)**: Đồng bộ Client ID chính xác, dọn dẹp logic đăng nhập (loại bỏ getAuthToken gây nhiễu) và khôi phục quyền `*://*/*`.
- **Rebranding**: Đổi tên Extension thành "ImageSnap — Save Images & Context to Google Sheets".
- **PostgreSQL Migration**: Chuyển đổi storage từ `user_db.json` sang PostgreSQL. Cập nhật `server.ts` và `db.ts` sang mô hình async.
- **Fix Bug [BUG-012]**: Sửa lỗi không gõ được dấu phẩy khi tạo Options cho trường 'select'.
- **Đồng bộ phiên bản**: Cập nhật toàn bộ hệ thống (Package, Manifest, UI) lên bản **v1.3.5**.

### Dừng ở đâu?
- Đăng nhập Google đã hoạt động hoàn hảo trên mọi môi trường.
- Tính năng Snap đã truy cập được nội dung trên mọi website.
- Toàn bộ tài liệu dự án đã được cập nhật đến phiên bản v1.3.5.

---

## Open Items cần attention

```
[x] [DEV-2026W19-01] PostgreSQL Migration → COMPLETED.
[x] [DEV-2026W19-02] Fix Select Comma Bug → COMPLETED.
[x] [DEV-2026W19-06] Fix Auth & Permissions v1.3.5 → COMPLETED.
[ ] [DEV-2026W19-04] Auto-Silent Login implementation.
[ ] [DEV-2026W19-08] Xây dựng Dashboard quản trị người dùng cho Admin.
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
