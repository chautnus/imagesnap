---
id: changelog_hien_ro_nut_sua_data_20260913
type: changelog
title: "Hiện rõ nút Sửa/Xóa trong thẻ dữ liệu Data tab (F-005)"
tags: [data, ui, edit, admin]
keywords: [DataProductCard, opacity-0, group-hover, edit-button, delete-button]
status: active
created: 2026-09-13
updated: 2026-09-13
summary: "Nút Sửa (Pencil) và Xóa (Trash2) trong thẻ dữ liệu tab Data từng bị ẩn hoàn toàn (opacity-0, chỉ hiện khi group-hover), gây khó dùng nhất là trên mobile không có hover thật. Đã bỏ opacity-0 để 2 nút luôn hiển thị."
---

## Hiện rõ nút Sửa/Xóa trong thẻ dữ liệu (2026-09-13)

### Vấn đề

`src/web/components/DataProductCard.tsx` đặt container chứa nút Edit + Delete trong
class `opacity-0 group-hover:opacity-100` ở cả 2 layout (grid và list) — nút vô hình
cho tới khi hover/tap trúng đúng vùng thẻ mới hiện, khó dùng đặc biệt trên thiết bị
không có hover thật (mobile/touch).

### Thay đổi

- **`src/web/components/DataProductCard.tsx`**: bỏ `opacity-0 group-hover:opacity-100`
  trên 2 container nút (grid layout dòng ~41, list layout dòng ~107), giữ nguyên
  `transition-all` và toàn bộ style khác (`bg-white/90 backdrop-blur-sm rounded-lg
  border border-line shadow-sm`) cũng như handler `onClick`/`onEdit`/`onDelete`. Nút
  Edit và Delete giờ luôn hiển thị mặc định.

### Xác nhận

`npm run build` (Next.js + Vite extension) pass hoàn toàn, không lỗi TypeScript/
ESLint. Re-run độc lập (không tin report tự khai) — đối chiếu code thật khớp
done-definition, build chạy lại pass.

### Kiến trúc

Không có quyết định kiến trúc mới — sửa CSS visibility thuần túy, không đổi contract/
logic.
