---
id: prd_edit-data-record_20260829
title: "Sửa thông tin record trong Data"
status: draft
version: 1.0
author: chautnus
created: 2026-08-29
updated: 2026-08-29
tags: [data, edit, sheets, admin]
summary: "Cho phép Admin sửa trực tiếp thông tin 1 record đã lưu trong Data mà không cần xóa/tạo lại."
---

# PRD: Sửa thông tin record trong Data

## 1. Overview
**Problem**: `saveProduct()` chỉ append dòng mới vào Google Sheets — không có cách sửa lại record đã lưu sai, phải xóa rồi tạo lại (mất ID gốc, phải upload lại ảnh).
**Solution**: Thêm nút Edit (chỉ Admin) trên record trong DataTab, mở form prefill dữ liệu hiện tại, lưu bằng `updateProduct()` mới (tái dùng `updateRowBySearch()` sẵn có — đang dùng cho Category) để ghi đè đúng dòng thay vì tạo dòng mới.
**Success Metrics**: Admin sửa được 1 record đã tồn tại và thấy thay đổi phản ánh ngay trong DataTab; không phát sinh row trùng trong Sheet.

## 2. Background & Context
Data hiện được lưu trên Google Sheets (không có DB thật), mỗi category = 1 sheet, cột A = ID dùng để tìm dòng. Category đã có cơ chế edit qua `updateRowBySearch()` (src/shared/services/categoryService.ts:18) nhưng Product thì chưa — chỉ có `saveProduct` (append) và `deleteProduct`.

## 3. Jobs To Be Done (JTBD)
> When Admin phát hiện 1 record đã lưu có thông tin sai, I want to sửa trực tiếp field đó, so I can giữ dữ liệu chính xác mà không mất ảnh/ID gốc.

## 4. Stakeholders
| Role | Name/Team | Responsibility |
|------|-----------|----------------|
| Product Owner | chautnus | Phê duyệt PRD |
| Tech Lead | chautnus | Kiến trúc kỹ thuật |
| Dev | Antigravity (qua MCP) | Triển khai |

## 5. User Stories & Acceptance Criteria

### US-006: Nút Edit trên record
**As a** Admin, **I want to** thấy nút Edit trên mỗi record trong DataTab, **So that** tôi biết record nào sửa được

**Acceptance Criteria:**
- [ ] Given tôi là Admin, When xem DataProductCard (list hoặc grid), Then thấy nút Edit cạnh nút Delete
- [ ] Given tôi KHÔNG phải Admin, When xem DataProductCard, Then KHÔNG thấy nút Edit

### US-007: Form edit prefill dữ liệu hiện tại
**As a** Admin, **I want to** mở form edit đã prefill sẵn dữ liệu hiện tại của record, **So that** tôi không phải nhập lại từ đầu

**Acceptance Criteria:**
- [ ] Given tôi click Edit trên 1 record, When form mở ra, Then tất cả field data hiện tại được điền sẵn đúng theo schema của category
- [ ] Given form edit đang mở, When tôi không sửa gì và bấm Save, Then dữ liệu Sheet không đổi (idempotent)

### US-008: Lưu ghi đè đúng dòng, không tạo row trùng
**As a** Admin, **I want to** lưu thay đổi ghi đè đúng dòng trong Sheet, **So that** dữ liệu không bị trùng lặp và ID/ảnh/tác giả gốc được giữ nguyên

**Acceptance Criteria:**
- [ ] Given tôi sửa field và bấm Save, When lưu thành công, Then Sheet chỉ có 1 dòng với ID đó (không tạo row mới)
- [ ] Given record đã lưu, When tôi sửa field data, Then ID, createdAt, authorId, authorName, images KHÔNG bị thay đổi
- [ ] Given user là staff (dùng proxy API), When sửa record, Then luồng staff proxy cũng update đúng thay vì append

## 6. Functional Requirements
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Thêm hàm `updateProduct()` trong `productService.ts`, dùng `updateRowBySearch()` có sẵn | Must Have | Tương tự pattern `saveCategory(isNew=false)` |
| FR-002 | Thêm `handleUpdateProduct` trong `useAppData.ts`, phân nhánh staff/non-staff giống `handleSaveProduct` | Must Have | |
| FR-003 | Thêm nút Edit trên `DataProductCard.tsx`, chỉ hiện khi `isAdmin` | Must Have | Cùng pattern UI với nút Trash2 hiện có |
| FR-004 | Form edit tái dùng field schema của category, prefill từ `product.data` | Must Have | Component mới `EditProductForm` |
| FR-005 | Thêm nhánh update trong staff proxy route `server.ts` | Must Have | Route mới `/api/proxy/update-product` |
| FR-006 | Ảnh KHÔNG được sửa trong phạm vi này — giữ nguyên `images` khi update | Won't Have (out of scope) | Theo quyết định user |

## 7. Non-Functional Requirements
| Category | Requirement | Metric |
|----------|-------------|--------|
| Data Integrity | Update không được tạo duplicate row | 0 row trùng ID sau update |
| Data Integrity | ID/createdAt/Author/images không đổi sau update | So sánh trước/sau |
| Concurrency | Không cần lock — best-effort, ghi đè cuối thắng | Out of scope xử lý conflict |

## 8. Out of Scope
- Sửa/thay/xóa ảnh của record
- Audit trail / lịch sử thay đổi
- Bulk edit nhiều record cùng lúc
- Sửa category schema (đã có `CategoryEditor` riêng)
- Non-admin tự sửa record do chính mình tạo

## 9. Dependencies
- Google Sheets API (`updateRowBySearch` trong `sheets.ts` — đã tồn tại)
- Staff proxy backend API (`server.ts`) — cần thêm route mới

## 10. Definition of Done (Feature-level)
- [ ] Tất cả Acceptance Criteria US-006..US-008 đã pass
- [ ] Test thủ công: sửa 1 record, xác nhận Sheet không tạo row mới, ID/ảnh/author giữ nguyên
- [ ] Tài liệu đã cập nhật (changelog)
- [ ] Code review đã done
- [ ] PRD status cập nhật → `approved`

## 11. Timeline
| Milestone | Date | Notes |
|-----------|------|-------|
| PRD approved | 2026-08-29 | |

## 12. Open Questions
(none — đã điều tra và giải quyết trong plan-arch)

## 13. Changelog
| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-08-29 | chautnus | Initial draft |
