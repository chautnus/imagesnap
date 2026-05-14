# ANTIGRAVITY.md — SESSION CONTEXT FILE
> File này là "bộ nhớ ngắn hạn" giữa các phiên làm việc.
> Agent PHẢI đọc file này đầu tiên (BOOT-01).
> Agent PHẢI cập nhật cuối mỗi phiên (/sync).

---

## Thông tin dự án
- **Project Name**: ImageSnap
- **Official Domain**: [www.imagesnap.cloud](https://www.imagesnap.cloud)
- **Status**: Active / Production Ready
- **Core Architecture**: Centralized Storage (Staff-to-Admin Proxy) / Next.js SSR

## 🚀 Key Features
- **Next.js App Router**: Full SSR/SSG support for SEO optimization.
- **Centralized Storage**: Staff saves directly to Admin's Drive/Sheets.
- **Admin Dashboard**: Manage users, categories, and master workspace.
- **Automated Testing**: Playwright suite for E2E reliability.

---

## Trạng thái hiện tại

**Last updated**: 2026-05-07 10:05
**Last session by**: Antigravity
**Current sprint focus**: Next.js Migration, SEO Optimization & Chrome Store Preparation.

---

## Context tóm tắt

### Đang làm gì?
Đã hoàn thành việc chuyển đổi toàn bộ ứng dụng sang **Next.js (App Router)** để tối ưu hóa SEO. Toàn bộ hệ thống đã được nâng cấp lên phiên bản **v1.4.0**.

### Đã làm gì trong phiên trước?
- **Next.js Migration (v1.4.0)**: Chuyển đổi từ Vite SPA sang Next.js App Router. Port thành công các trang Landing, Pricing, Dashboard và API routes.
- **SEO Optimization**: Tự động hóa `sitemap.xml` và `robots.txt`. Thêm Google Analytics và thẻ meta Open Graph branded.
- **Accessibility**: Bật lại tính năng zoom cho người dùng di động (`user-scalable=yes`).
- **Railway Compatibility**: Sửa lỗi Healthcheck bằng cách bind host `0.0.0.0` và thêm endpoint `/api/health`.
- **UX Improvement**: Giữ nguyên giá trị của các trường `select` và `date` sau khi lưu để thuận tiện cho việc nhập liệu hàng loạt.
- **Đồng bộ phiên bản**: Cập nhật toàn bộ hệ thống lên bản **v1.4.8**.
- **Mobile & PWA Sync**: Rà soát và sửa lỗi Web Share Target API cho thiết bị di động, chuyển đổi lưu trữ từ Cache sang IndexedDB.
- **Hotfix Auth Redirect**: Sửa lỗi thiếu script GSI, logic singleton cho `tokenClient`, và lỗi vòng lặp useEffect (v1.4.7).
- **Share Interception Fix**: Thêm server-side fallback cho `/share` để tránh lỗi "server action not found" và tối ưu hóa SW activation (v1.4.8).
- **Documentation Audit**: Cập nhật toàn bộ hệ thống tài liệu (`BR.md`, `ARCH.md`) theo kiến trúc Next.js mới và thêm hướng dẫn cài đặt di động.

## TỔNG KẾT TRẠNG THÁI (v1.4.8)
- **Hệ thống**: Đã ổn định trên Next.js App Router.
- **PWA**: Share Target hoạt động tốt trên Android, có hướng dẫn bù đắp cho iOS.
- **Auth**: Đã fix triệt để lỗi kẹt màn hình logo và thiếu script GSI.
- **Tài liệu**: Đã rà soát và cập nhật toàn bộ (v1.4.8).

### Dừng ở đâu?
- Toàn bộ tài liệu dự án đã được cập nhật đến phiên bản v1.4.8.
- Tính năng Share Target đã được sửa lỗi logic và sẵn sàng cho việc cài đặt PWA trên điện thoại.

---

## Open Items cần attention

```
[x] [DEV-2026W19-10] Final QA & Extension Submission.
[x] [DEV-2026W19-11] Documentation Audit & Mobile PWA Guide.
[ ] [DEV-2026W19-12] Promote PWA installation to mobile users via UI banner.
```

---

## Tech context quan trọng

### Dependency versions (critical)
```
node:     >=18.0.0
next:     ^16.2.4
react:    ^19.0.0
pg:       ^8.20.0
```

### Environment notes
- Dự án hiện đã chuyển sang Next.js App Router hoàn toàn.
- Server API được tích hợp trực tiếp vào Next.js API Routes.

---

## Agent notes (phiên này để lại cho phiên sau)

- Metadata đã nhất quán và chuẩn SEO.
- Phiên sau nên tập trung vào việc đóng gói extension và chuẩn bị ảnh chụp màn hình mới cho Store (do UI Next.js có thay đổi nhẹ).
