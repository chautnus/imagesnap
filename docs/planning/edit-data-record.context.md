## Elicitation — 2026-08-29

Feature ID: F-003
Problem: saveProduct() chỉ append dòng mới, không có cách sửa lại thông tin record đã lưu sai — phải xóa và tạo lại, mất ID/ảnh gốc.
Goal: Admin sửa trực tiếp field data của 1 record đã lưu, ghi đè đúng dòng trong Sheet (không tạo row trùng), phản ánh ngay trong DataTab.
Scope IN: Nút Edit trên DataProductCard (chỉ Admin); form edit prefill tái dùng field schema category; updateProduct() trong productService.ts (tái dùng updateRowBySearch có sẵn); handleUpdateProduct trong useAppData.ts; nhánh update trong staff proxy route; giữ nguyên ID/createdAt/Author
Scope OUT: Sửa/thay ảnh, audit trail/lịch sử thay đổi, bulk edit, sửa category schema, non-admin tự sửa record của mình
Users: Admin/staff quản lý data — When phát hiện record có thông tin sai, I want sửa trực tiếp field đó, so I can giữ dữ liệu chính xác mà không mất ảnh/ID
Stories: US-006, US-007, US-008
Constraints: Google Sheets là data store duy nhất; update qua updateRowBySearch theo ID cột A; không phá vỡ luồng tạo mới hiện có
NFR: Không tạo duplicate row; không mất ảnh cũ; concurrency out of scope (ghi đè cuối thắng)

---
## PRD — 2026-08-29
Path: docs/prd/edit-data-record.md
Version: 1.0
Summary: Cho phép Admin sửa trực tiếp thông tin 1 record đã lưu trong Data mà không cần xóa/tạo lại.

---
## Architecture — 2026-08-29
Pattern: Mirror pattern Category-edit (updateRowBySearch)
ADR-002: Product edit dùng updateRowBySearch, mirror pattern Category

---
## Tasks — 2026-08-29
Total: 9 tasks (T-0014..T-0022), 17h estimate
Sprint: N/A
