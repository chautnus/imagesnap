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
- **Deployment Platform**: Vercel (Production) / Railway (Backup/Legacy)

## 🚀 Key Features
- **Next.js App Router**: Full SSR/SSG support for SEO optimization.
- **Centralized Storage**: Staff saves directly to Admin's Drive/Sheets.
- **Admin Dashboard**: Manage users, categories, and master workspace.
- **Automated Testing**: Playwright suite for E2E reliability.

---

## Trạng thái hiện tại

**Last updated**: 2026-05-14 23:14
**Last session by**: Antigravity
**Current sprint focus**: Mobile Share Target Stability & Single-Signal Architecture.

---

## ⚠️ PROTOCOL QUAN TRỌNG (DÀNH CHO AGENT)
- **LUÔN LUÔN** trình bày kế hoạch (Implementation Plan) trước khi sửa code.
- **TUYỆT ĐỐI KHÔNG** tự ý thực hiện (Execute) khi chưa nhận được sự phê duyệt rõ ràng (ví dụ: "Approve", "Đồng ý", v.v.) từ User.
- **KIẾN TRÚC TÍN HIỆU ĐƠN (SINGLE-SIGNAL)**: Luôn ưu tiên dùng URL `share_id` làm tín hiệu duy nhất cho luồng Share Target, tránh dùng song song `BroadcastChannel` gây tranh chấp.

---

## Context tóm tắt

### Đang làm gì?
Đã triển khai kiến trúc **Single-Signal (Tín hiệu Đơn)** và sửa lỗi build SSR (window is not defined) để ổn định hệ thống (v1.7.6).

### Đã làm gì trong phiên trước?
- **Next.js Migration (v1.4.0)**: Chuyển đổi thành công sang Next.js App Router.
- **Single-Signal Architecture (v1.7.5)**: 
    - Loại bỏ `BroadcastChannel` cho luồng nhận dữ liệu mới, chuyển hoàn toàn sang dùng `share_id` trên URL điều hướng 303.
    - Cập nhật `sw.js` sử dụng `sid` (Share ID) làm Primary Key trong IndexedDB.
    - Sửa lỗi nhân đôi ảnh trong `CaptureTab.tsx` bằng cơ chế lọc trùng `Set`.
- **SSR Fixes (v1.7.6)**:
    - Sửa lỗi `ReferenceError: window is not defined` tại trang Dashboard trong quá trình build (prerendering).
    - Thêm kiểm tra `typeof window !== 'undefined'` cho các truy cập `localStorage` và `window.location`.

## TỔNG KẾT TRẠNG THÁI (v1.7.6)
- **Hệ thống**: Đã ổn định và có thể build thành công.
- **PWA**: Hoàn thiện kiến trúc nhận dữ liệu chia sẻ mượt mà và tin cậy.

### Dừng ở đâu?
- Hệ thống đang ở phiên bản **v1.7.6**.
- Đã fix lỗi build kẹt tại `/dashboard`.

---

## Open Items cần attention

```
[x] [DEV-2026W19-12] Implement Single-Signal Architecture for Share Target.
[x] [DEV-2026W19-12-FIX] Resolve SSR build errors (window/localStorage).
[ ] [DEV-2026W19-13] Verify PWA sharing reliability on multiple devices (Android/iOS).
[ ] [DEV-2026W19-14] Promote PWA installation to mobile users via UI banner.
```

---

## Tech context quan trọng

### Dependency versions (critical)
```
node:     >=18.0.0
next:     ^16.2.4
react:    ^19.0.0
pg:     ^8.20.0
```

---

## Agent notes (phiên này để lại cho phiên sau)

- **QUY TẮC PHÊ DUYỆT**: Luôn đợi user gõ "Approve" mới được sửa file.
- Luồng Share Target hiện tại dựa hoàn toàn vào `share_id` từ URL. Không được thêm lại `BroadcastChannel` cho tín hiệu này.
- Khi thêm logic client-side mới, luôn chú ý kiểm tra `typeof window !== 'undefined'` để tránh lỗi build SSR.
