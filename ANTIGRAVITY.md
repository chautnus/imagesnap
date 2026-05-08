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
- **Đồng bộ phiên bản**: Cập nhật toàn bộ hệ thống lên bản **v1.4.0**.
- **Store Preparation**: Chuẩn bị tài liệu giải trình quyền (`PRIVACY_JUSTIFICATION.md`) cho Chrome Web Store.
- **Mobile & PWA Fixes**: Khôi phục Share Target, cấu hình manifest.json và sửa lỗi vỡ UI mobile.
- **SEO Audit & Fixes**: 
  - Thực hiện audit SEO toàn diện và phát hiện 12+ route quan trọng (Blog, Compare, Use Cases) bị lỗi 404 sau khi chuyển sang Next.js.
  - Port thành công toàn bộ các trang nội dung sang dynamic routes (`app/blog/[slug]`, `app/compare/[slug]`, `app/use-cases/[slug]`).
  - Cập nhật `robots.txt` để bảo mật trang dashboard và tối ưu crawl budget.
  - Tích hợp `generateMetadata` để tối ưu SEO cho từng bài viết và trang so sánh.

### Dừng ở đâu?
- Ứng dụng Next.js đã build thành công và hoạt động tốt trên Railway.
- Extension đã được đồng bộ hóa logic với Web App.
- Toàn bộ tài liệu dự án đã được cập nhật đến phiên bản v1.4.0.

---

## Open Items cần attention

```
[x] [DEV-2026W19-07] Next.js Migration (SSR/SEO) → COMPLETED.
[x] [DEV-2026W19-08] Railway Healthcheck Fix → COMPLETED.
[x] [DEV-2026W19-09] Chrome Store Permission Justification → COMPLETED.
[ ] [DEV-2026W19-10] Final QA & Extension Submission.
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
