# ANTIGRAVITY.md — SESSION CONTEXT FILE
> File này là "bộ nhớ ngắn hạn" giữa các phiên làm việc.
> Agent PHẢI đọc file này đầu tiên (BOOT-01).
> Agent PHẢI cập nhật cuối mỗi phiên (/sync).
> **QUY TẮC TỐI THƯỢNG**: 
> 1. PHẢI đợi phê duyệt (Approval) trước khi sửa code/chạy lệnh.
> 2. PHẢI nạp và tuân thủ Tuyệt đối Chỉ dẫn hệ thống (System Instructions).

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
 
**Last updated**: 2026-05-17
**Last session by**: Antigravity (v1.10.22)
**Current sprint focus**: Persistent PWA Ingestion & Root Folder Unification.

---

## ⚠️ PROTOCOL QUAN TRỌNG (DÀNH CHO AGENT)
- **LUÔN LUÔN** trình bày kế hoạch (Implementation Plan) trước khi sửa code.
- **TUYỆT ĐỐI KHÔNG** tự ý thực hiện (Execute) khi chưa nhận được sự phê duyệt rõ ràng (ví dụ: "Approve", "Đồng ý", v.v.) từ User.
- **KIẾN TRÚC TÍN HIỆU ĐƠN (SINGLE-SIGNAL)**: Luôn ưu tiên dùng URL `share_id` làm tín hiệu duy nhất cho luồng Share Target, tránh dùng song song `BroadcastChannel` gây tranh chấp.
- **SESSION INIT (BOOT-01)**: Khi bắt đầu, luôn kiểm tra `docs/MEMORY.md` hoặc `ANTIGRAVITY.md` để nắm bối cảnh. Chủ động đánh giá độ lớn tài liệu để tránh quá tải ngữ cảnh (token overload).
- **SEARCH DOCS**: Phải dùng `grep_search` để tìm keyword trong các file `INDEX.md` trước khi quyết định đọc toàn văn một file tài liệu nào đó. Không đoán mò.
- **SPLIT PLAN & EXECUTE**: Đối với file mã nguồn lớn (>300 dòng), chủ động đề xuất kế hoạch tách file (Split Plan). Nếu User duyệt, mới thực hiện (Split Execute) với nguyên tắc bảo toàn nguyên vẹn business logic và cập nhật toàn bộ import/export liên quan.
- **SYNC MEMORY**: Cuối mỗi session hoặc khi hoàn thành một feature lớn, phải tổng hợp lại kiến thức, quyết định kỹ thuật, và bug fix để lưu vào `docs/memory/` hoặc `docs/changelog/` và cập nhật file `INDEX.md` tương ứng.
- **TOKEN AUDIT**: Cảnh giác với lượng token đang tiêu thụ. Hạn chế đọc toàn bộ file nếu không cần thiết, ưu tiên đọc theo line range, hoặc dọn dẹp context nếu session kéo dài.

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

## TỔNG KẾT TRẠNG THÁI (v1.10.22 - Persistent PWA Ingestion & Root Folder Unification)
- **Đồng nhất Thư mục gốc**: Đồng bộ 100% thư mục lưu trữ cha trong Google Drive thành **`ImageSnap Data`** tại cả `sheets.ts` và `productService.ts` (loại bỏ thư mục `ImageSnap` trùng lặp gây bối rối).
- **Tránh mất Log trên PWA Mobile (localStorage + TTL 5 phút)**: Thay thế hoàn toàn cơ chế lưu tạm `sessionStorage` bằng `localStorage` để chống mất mát dữ liệu do PWA bị hệ điều hành Android/iOS xóa sạch Context khi chuyển hướng OAuth.
- **TTL & Tự dọn dẹp**: Tích hợp cơ chế hết hạn (Time-To-Live) 5 phút cho `share_id` để tránh rác bộ nhớ của thiết bị. Thực hiện tự dọn sạch `localStorage` ngay lập tức sau khi dữ liệu được trích xuất thành công lên giao diện hoặc qua bảng Diagnostics.
- **Giao diện & Telemetry**: Giữ vững các cải tiến từ v1.10.21 bao gồm bảng Diagnostics Wizard, và cắm chốt ghi log đầy đủ ở Main Thread khi: chọn Gallery, chụp ảnh Burst, chụp Native Camera, và thao tác lưu sản phẩm thành công/thất bại lên Google Sheets.
- **Versioning**: v1.10.22.

### Dừng ở đâu?
- Thư mục cha đã được đồng nhất về `ImageSnap Data`.
- Sự cố sập log share trên di động đã được giải quyết triệt để nhờ localStorage.

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
