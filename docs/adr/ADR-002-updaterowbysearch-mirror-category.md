---
id: ADR-002
title: "Product edit dùng updateRowBySearch, mirror pattern Category"
status: accepted
date: 2026-08-29
tags: [data, sheets, edit, api]
summary: "Sửa thông tin Product record bằng cách tái dùng updateRowBySearch() có sẵn, thay vì append-with-flag hoặc endpoint riêng biệt."
---

## Context
Cần thêm khả năng sửa (update) 1 record Product đã lưu trong Google Sheets mà không tạo row trùng. Category đã có cơ chế update tương tự (`saveCategory(isNew=false)` → `updateRowBySearch()`), nhưng Product hiện chỉ có `saveProduct()` (luôn append) và `deleteProduct()`. Ngoài ra staff proxy route `/api/proxy/save-product` (server.ts:152) cũng chỉ có nhánh `:append`, chưa có update.

## Decision
Thêm `updateProduct()` trong `productService.ts` tái dùng `updateRowBySearch()` đã có sẵn trong `sheets.ts`, theo đúng pattern `saveCategory(isNew)` của Category. Thêm route mới `/api/proxy/update-product` trong `server.ts` cho luồng staff, dùng cùng logic tìm-dòng-theo-ID (`A:A` scan) rồi `PUT` giá trị (Sheets API `values:update`), mirror logic của `updateRowBySearch`.

## Rationale
Codebase đã có pattern y hệt hoạt động ổn định cho Category — tái dùng giảm rủi ro, nhất quán kiến trúc, không cần thiết kế cơ chế mới. Vì quyết định user đã loại bỏ audit trail và sửa ảnh khỏi scope, không cần giải pháp phức tạp hơn.

## Options Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| A — Mirror pattern Category (updateRowBySearch) | Nhất quán, tái dùng code có sẵn, low complexity | Vẫn phụ thuộc full-column scan để tìm ID | ✅ Chosen |
| B — Append + flag "latest" (soft-update) | Giữ lịch sử ẩn, dễ mở rộng audit sau này | Trái quyết định "không cần audit trail", tăng phức tạp đọc dữ liệu | ❌ Rejected |
| C — Endpoint update độc lập, không tái dùng sheets.ts | Tách biệt hoàn toàn | Trùng lặp logic tìm-dòng-theo-ID, vi phạm DRY | ❌ Rejected |

## Consequences
Positive: Code nhất quán với Category-edit, thời gian triển khai nhanh (Low complexity), không cần thay đổi schema Sheet.
Trade-offs: Update vẫn phải scan toàn bộ cột A để tìm dòng (chấp nhận được ở quy mô hiện tại, giống Category).
Risks: Nếu 2 admin sửa cùng 1 record đồng thời, ghi đè cuối thắng (đã chấp nhận là out-of-scope theo NFR trong PRD).
