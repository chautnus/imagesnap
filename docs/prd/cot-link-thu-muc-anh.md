---
id: prd_cot-link-thu-muc-anh_20260917
title: "Cột Folder Link trong Sheet"
status: draft
version: 1.0
author: Antigravity (rà soát bởi Claude)
created: 2026-09-17
updated: 2026-09-17
tags: [sheets, drive, migration, product]
summary: "Thêm cột Folder Link ở cuối sheet category chứa URL thư mục Google Drive của từng bản ghi và tự động backfill cho sheet cũ."
---

# PRD: Cột Folder Link trong Sheet

## 1. Overview
**Problem**: Google Sheet hiện tại không có cột link trực tiếp dẫn tới folder Google Drive chứa ảnh của từng bản ghi sản phẩm (cột 'Images' hiện tại chỉ chứa URL của từng ảnh lẻ). Khi cần xem toàn bộ ảnh hoặc chia sẻ cả thư mục gốc của một bản ghi, người dùng phải mở từng ảnh hoặc tìm kiếm thủ công trong Drive.
**Solution**: Thêm cột 'Folder Link' vào vị trí CUỐI CÙNG của mỗi sheet category, chứa URL thư mục Drive dạng `https://drive.google.com/drive/folders/{folderId}`. Tự động thêm cột này cho bản ghi mới tạo và có cơ chế migration phát hiện sheet cũ để bổ sung header kèm backfill link cho các dòng hiện có mà không làm gián đoạn hệ thống.
**Success Metrics**:
- 100% bản ghi mới được lưu qua `saveProduct` có sẵn URL Drive folder chính xác tại cột 'Folder Link'.
- Mọi sheet category cũ khi người dùng khởi động app được tự động cập nhật header 'Folder Link' và backfill đầy đủ link cho các dòng cũ.
- Không gây lỗi lệch chỉ số cột (column index shift) ở `dataService.ts` và không tạo folder Drive trùng lặp.

## 2. Background & Context
Hệ thống ImageSnap lưu trữ metadata sản phẩm trên Google Sheets và hình ảnh trong các thư mục tương ứng trên Google Drive theo cấu trúc phân cấp: `ImageSnap Data` -> `[Category Name]` -> `[Key Value / Product Name]`.
Người dùng thường xuyên mở trực tiếp file Google Sheet trên Google Drive để tra cứu nhanh, kiểm kê hoặc chia sẻ thư mục ảnh của sản phẩm cho đối tác. Việc thiếu đường link trực tiếp đến folder của sản phẩm gây bất tiện lớn trong vận hành.
Tuy nhiên, `dataService.ts` phân tích các dòng trong sheet dựa hoàn toàn vào chỉ số vị trí cố định (positional index: `r[0]` đến `r[6]` cho các trường mặc định, `r[7+fIdx]` cho các dynamic fields). Do đó, cột mới bắt buộc phải nằm ở cuối cùng để đảm bảo tính toàn vẹn dữ liệu.

### Data Destructive & Safety Assessment:
- **Phạm vi tác động (Touches)**: Ghi/cập nhật header dòng 1 của sheet category và backfill giá trị cột mới cho các dòng dữ liệu cũ trong mọi sheet category đã tồn tại.
- **Thành phần tham chiếu (Referrers)**:
  - `src/shared/services/dataService.ts`: Đọc positional, không bị ảnh hưởng do cột mới nằm sau dynamic field cuối cùng.
  - `src/shared/lib/sheets.ts`: Hàm `ensureSheetExists` hiện tại chỉ tạo header khi tạo sheet mới, chưa có logic bổ sung cột cho sheet đã có.
  - `src/shared/services/productService.ts`: Nơi tạo `row` mới trong `saveProduct` và cập nhật trong `updateProduct`.
- **Bảo toàn dữ liệu (Must-keep)**: Thứ tự các cột hiện có (`ID`, `Created At`, `Images`, `Name`, `Tags`, `Author ID`, `Author Name`, `...fields`) phải giữ nguyên 100%. Dữ liệu ảnh và trường thông tin của mọi bản ghi cũ không được ghi đè, làm trống hoặc mất mát trong quá trình backfill.

## 3. Jobs To Be Done (JTBD)
> **When** người dùng ImageSnap mở trực tiếp Google Sheet trên Drive để xem hoặc chia sẻ thư mục ảnh gốc của một bản ghi sản phẩm, **I want to** có một cột link dẫn thẳng đến folder Drive của bản ghi đó ngay trong bảng tính, **so I can** mở nhanh và chia sẻ toàn bộ ảnh mà không phải lục tìm từng ảnh lẻ trong cột Images hoặc tìm thủ công trên Drive.

## 4. Stakeholders
| Role | Name/Team | Responsibility |
|------|-----------|----------------|
| Product Owner | ImageSnap Team | Phê duyệt PRD và nghiệm thu tính năng |
| Tech Lead | Claude / System Architect | Thiết kế kiến trúc và rà soát tác động |
| Dev | Antigravity | Triển khai code, migration và kiểm thử |

## 5. User Stories & Acceptance Criteria

### US-013: Lưu bản ghi mới kèm Folder Link
**As a** người dùng ImageSnap, **I want** mỗi bản ghi sản phẩm mới khi được lưu sẽ tự động có URL thư mục Drive tại cột 'Folder Link' ở cuối bảng tính, **So that** tôi có thể bấm mở ngay folder Drive của sản phẩm từ sheet.
*(Serves JTBD: Người dùng mở trực tiếp Google Sheet để truy cập nhanh thư mục ảnh)*

**Acceptance Criteria:**
- [ ] Given người dùng tạo mới một sản phẩm qua form và lưu thành công, When kiểm tra file Google Sheet tại tab category tương ứng, Then dòng mới được thêm có giá trị cột cuối cùng là URL dạng `https://drive.google.com/drive/folders/{folderId}` trỏ đúng vào thư mục của sản phẩm trên Google Drive.
- [ ] Given sheet category mới được tạo lần đầu, When hàm `ensureSheetExists` chạy, Then header của sheet chứa 'Folder Link' ở vị trí cuối cùng sau tất cả các dynamic fields của category.
- [ ] Given sản phẩm đã tồn tại được cập nhật qua `updateProduct`, When cập nhật thông tin sản phẩm, Then giá trị Folder Link hiện tại trong sheet được bảo toàn (hoặc tự resolve nếu chưa từng có) và không bị xóa hoặc làm trống.

### US-014: Tự động Migration và Backfill cho Sheet cũ
**As a** người dùng đã có sẵn dữ liệu và sheet từ các phiên bản trước, **I want** hệ thống tự động phát hiện sheet cũ thiếu cột 'Folder Link' để bổ sung header và điền URL folder Drive cho các dòng cũ ngay khi khởi động app, **So that** dữ liệu cũ đồng bộ với định dạng mới mà không cần thao tác thủ công hay mất mát dữ liệu hiện có.
*(Serves JTBD: Tra cứu nhanh thư mục ảnh cho cả các sản phẩm đã lưu trước đây)*

**Acceptance Criteria:**
- [ ] Given một sheet category đã tồn tại có header chưa có cột 'Folder Link', When app khởi động, Then header dòng 1 được cập nhật thêm cột 'Folder Link' ở ô cuối cùng (sau field cuối của category), chạy nền không chặn UI.
- [ ] Given các dòng dữ liệu cũ trong sheet chưa có giá trị cột Folder Link, When quá trình backfill thực hiện, Then hệ thống tìm folder tương ứng qua `findOrCreateFolder` và điền URL đúng vào cột Folder Link cho từng dòng cũ bằng 1 lệnh ghi dải cột duy nhất.
- [ ] Given quá trình backfill thực hiện tìm folder cho các dòng cũ, When gọi hàm tìm kiếm/tạo folder, Then hệ thống tận dụng cache 24h và map trong-phiên để không tạo ra bất kỳ folder trùng lặp nào trên Drive.
- [ ] Given quá trình migration hoàn tất, When ứng dụng gọi `fetchAllAppData`, Then dữ liệu đọc lên UI hiển thị đầy đủ, chính xác, không bị xáo trộn giá trị giữa các trường dữ liệu.

## 6. Functional Requirements
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Bổ sung header 'Folder Link' vào cuối danh sách headers trong `saveProduct` và khi khởi tạo sheet category mới | Must Have | Cột mới nằm sau dynamic fields cuối cùng (`src/shared/services/productService.ts:40`). |
| FR-002 | Ghi giá trị `https://drive.google.com/drive/folders/${keyFolderId}` vào cuối mảng row khi lưu bản ghi mới | Must Have | Sử dụng lại `keyFolderId` đã được resolve trước đó (`src/shared/services/productService.ts:23, 55-56`). |
| FR-003 | Bảo toàn giá trị 'Folder Link' khi gọi `updateProduct`; nếu hàng chưa từng có thì tự resolve `keyFolderId` để điền | Must Have | (`src/shared/services/productService.ts:75-84`). |
| FR-004 | Cơ chế kiểm tra và bổ sung header 'Folder Link' cho các sheet category đã tồn tại | Must Have | Khắc phục hạn chế hiện tại của `ensureSheetExists` (`src/shared/lib/sheets.ts:168-170`). |
| FR-005 | Backfill URL Folder Link cho toàn bộ dòng dữ liệu cũ trong sheet, chạy background fire-and-forget lúc khởi động app, ghi 1 lệnh PUT dải cột duy nhất mỗi category | Must Have | Duyệt các dòng cũ, xác định `keyValue`, resolve folder qua `findOrCreateFolder`, điền URL vào cột tương ứng. |
| FR-006 | Chống tạo folder trùng lặp trong quá trình backfill | Must Have | Sử dụng cache `_folderCache` (`src/shared/lib/drive.ts:37-68`) + map trong-phiên. |\n\n## 7. Non-Functional Requirements
| Category | Requirement | Metric |
|----------|-------------|--------|
| Performance | Quá trình backfill và truy vấn folder không gây rate-limit Google Drive API | Tận dụng cache 24h, gom 1 lệnh PUT dải cột thay vì update từng dòng. |
| Security | Đường dẫn folder Drive tuân thủ phân quyền hiện có của workspace | Thư mục được đặt quyền tương thích với cấu trúc cha trong `ImageSnap Data`. |
| Scalability | Tương thích ngược với mọi category có số lượng dynamic fields tùy biến | Xác định vị trí cột 'Folder Link' động theo độ dài mảng fields của từng category. |

## 8. Out of Scope
- Không hiển thị cột hoặc đường link 'Folder Link' trên giao diện ứng dụng web/extension/PWA.
- Không thay đổi interface `Product` trong `src/shared/lib/types.ts`.
- Không thay đổi logic đọc dữ liệu trong `src/shared/services/dataService.ts`.
- Không hỗ trợ tùy chỉnh tên cột hoặc vị trí cột ngoài vị trí cuối cùng trong sheet.
- Không thêm safety-check chống race condition khi ghi dải cột (rủi ro đã được chấp nhận, xem ADR-004).
- Không hiển thị thông báo/toast khi migration nền đang chạy (chạy âm thầm, chỉ log console).

## 9. Dependencies
- Google Sheets API v4 (`spreadsheets.values.get`, `spreadsheets.values.update`, `spreadsheets.values.append`, `spreadsheets.batchUpdate`).
- Google Drive API v3 (`files.list`, `files.create`).
- Cấu trúc cột cố định: `dataService.ts` đọc dữ liệu theo index cố định (`r[0]` đến `r[6]` và `r[7+fIdx]`), do đó vị trí cột mới bắt buộc phải là `7 + cat.fields.length`.

## 10. Definition of Done (Feature-level)
- [ ] Tất cả Acceptance Criteria của US-013 và US-014 đã pass.
- [ ] Header 'Folder Link' xuất hiện ở cột cuối cùng trên mọi sheet category (cả mới và cũ).
- [ ] Bản ghi mới lưu có URL Folder Link chính xác; bản ghi cũ được backfill đầy đủ.
- [ ] Không có folder Drive trùng lặp được sinh ra trong quá trình backfill.
- [ ] `fetchAllAppData` trong `dataService.ts` hoạt động bình thường, không bị lệch trường dữ liệu.
- [ ] Kiểm tra tĩnh hoàn tất không có lỗi cú pháp hoặc runtime error.
- [ ] PRD status cập nhật → `approved`.

## 11. Timeline
| Milestone | Date | Notes |
|-----------|------|-------|
| PRD Draft & Review | 2026-09-17 | Hoàn thiện đặc tả và rà soát tác động |
| Architecture & Task Planning | 2026-09-17 | Thiết kế chi tiết hàm migration |
| Implementation & Backfill | 2026-09-17 | Triển khai code và kiểm thử |

## 12. Open Questions
(Đã giải quyết trong quá trình rà soát — xem Changelog)

## 13. Changelog
| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-09-17 | Antigravity (rà soát bởi Claude) | Initial draft PRD dựa trên Elicitation F-006; đã chốt thời điểm migration (tự động lúc khởi động app) và hành vi updateProduct (tự resolve nếu hàng chưa có Folder Link) sau khi hỏi user. |
