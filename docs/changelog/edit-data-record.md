---
id: changelog_edit_data_record_20260829
type: changelog
title: "Admin có thể sửa record trong Data tab, ghi đè đúng dòng Sheet (F-003)"
tags: [data, edit, sheets, admin, ui]
keywords: [DataProductCard, EditProductForm, updateProduct, updateRowBySearch, update-product, DataTab]
status: active
created: 2026-08-29
updated: 2026-08-29
summary: "Admin có thể sửa trực tiếp thông tin 1 record đã lưu trong Data (nút Edit -> form prefill -> Save), ghi đè đúng dòng trong Google Sheet thay vì phải xóa/tạo lại. ID/createdAt/author/images được giữ nguyên."
---

## Sửa thông tin record trong Data (2026-08-29)

### Vấn đề

`saveProduct()` (src/shared/services/productService.ts) chỉ append dòng mới vào
Google Sheets — không có cách sửa lại record đã lưu sai, buộc Admin phải xóa
(`deleteProduct`) rồi tạo lại từ đầu, mất ID gốc và phải upload lại ảnh. Category đã
có cơ chế edit qua `updateRowBySearch()` từ trước nhưng Product thì chưa.

### Thay đổi

- **`src/web/components/DataProductCard.tsx`**: thêm nút Edit (icon Pencil) cạnh nút
  Delete ở cả layout list và grid, chỉ hiện khi `isAdmin`, có `e.stopPropagation()`
  để không trigger mở detail.
- **`src/web/components/DataTab.tsx`**: thêm state `editingProduct`, render
  `EditProductForm` khi có record đang sửa; thêm prop `onUpdate` vào `DataTabProps`.
- **`src/web/components/EditProductForm.tsx`** (mới): form prefill dữ liệu hiện tại
  theo field schema của category — không có upload ảnh, không có search-suggestions
  (ngoài scope).
- **`src/shared/services/productService.ts`**: thêm `updateProduct()`, tái dùng
  `updateRowBySearch()` có sẵn (ADR-002), giữ nguyên `id`/`createdAt`/`images`/
  `authorId`/`authorName`, chỉ ghi đè `name`/`data`/`tags`. Hàm `saveProduct()` gốc
  không đổi.
- **`src/shared/hooks/useAppData.ts`**: thêm `handleUpdateProduct`, phân nhánh
  staff (gọi `/api/proxy/update-product`) / non-staff (gọi `updateProduct` trực
  tiếp) — nhánh staff tự gắn `categoryName` vào payload trước khi gửi (xem mục Bug
  tiềm ẩn bên dưới).
- **`server.ts`**: thêm route `POST /api/proxy/update-product` cho luồng staff —
  tìm dòng theo ID (GET `values/{sheet}!A:A`) rồi ghi đè (PUT `values/{sheet}!A{n}`),
  mirror logic của `updateRowBySearch`.
- **`app/dashboard/page.tsx`**: wire `onUpdate={handleUpdateProduct}` xuống `DataTab`.

### Bug tiềm ẩn phát hiện thêm (đã tránh lặp lại, chưa sửa route cũ)

Type `Product` không có field `categoryName` (chỉ có `categoryId`). Route staff cũ
`/api/proxy/save-product` dùng `product.categoryName || 'Data'` để chọn sheet nhưng
không nơi nào gán field này trước khi gửi — trên thực tế luôn fallback về sheet
'Data'. Route mới `update-product` KHÔNG lặp lại lỗi này: `handleUpdateProduct` tự
tra `categoryName` từ `appData.categories` trước khi gửi. Route `save-product` cũ
chưa được sửa (ngoài scope feature này).

### Xác nhận

`npx tsc --noEmit` pass. Full re-run 9/9 task's verify-cmd (không rút mẫu, vì batch
cuối + có ghi đè dữ liệu + đổi contract). Đối chiếu must-keep list (ID/createdAt/
authorId/authorName/images) — PASS, `saveProduct`/`deleteProduct` gốc không bị đụng.
Commit `03fd4c7`, đã push lên remote `main`.

### Kiến trúc

ADR-002: Product edit dùng `updateRowBySearch()`, mirror pattern Category-edit
(`saveCategory(isNew)`) thay vì soft-update/append-flag hoặc endpoint độc lập —
tái dùng code đã ổn định, độ phức tạp thấp, phù hợp vì audit trail và sửa ảnh đã
được loại khỏi scope theo quyết định của user.
