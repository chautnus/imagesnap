---
id: ADR-004
title: "Kiến trúc Migration và Backfill Cột Folder Link bằng Background Worker"
status: accepted
date: 2026-09-17
tags: [sheets, drive, migration, background-worker]
summary: "Triển khai migration cột 'Folder Link' ở cuối mỗi sheet category qua background worker không chặn UI, cập nhật dải cột duy nhất để tối ưu quota Google API."
---

## Context
Google Sheet hiện tại chưa có link trực tiếp tới thư mục Drive chứa ảnh của từng bản ghi sản phẩm.
Để đáp ứng JTBD của người dùng mà không làm lệch chỉ số cột cứng của `dataService.ts` (`r[0..6]`, `r[7+fIdx]`), cột 'Folder Link' bắt buộc phải được bổ sung ở vị trí CUỐI CÙNG (vị trí `7 + cat.fields.length`).
Hàm `ensureSheetExists` hiện tại trong `src/shared/lib/sheets.ts:168` chỉ kiểm tra `if (!sheet)` để tạo mới, chưa có cơ chế kiểm tra hay bổ sung cột cho sheet đã tồn tại. Ngoài ra, việc backfill nhiều dòng dữ liệu trên nhiều sheet category lúc khởi động app dễ gây nghẽn Google API quota (60 req/phút) và làm chậm thời gian mở app nếu chạy đồng bộ.

## Decision
1. **Thời điểm và mô hình thực thi**:
   - Gọi hàm migration `migrateFolderLinksInBackground(spreadsheetId, categories, token)` từ `fetchAllAppData` theo cơ chế **Fire-and-Forget (không await)**.
   - Luồng khởi động app tiếp tục render UI bình thường, không bị gián đoạn hay chậm trễ.
2. **Cơ chế phát hiện header thiếu cột**:
   - Đọc dòng 1 của từng sheet category: `getSheetRows(spreadsheetId, '${sheetTitle}!1:1')`.
   - Lấy mảng headers thực tế `existingHeaders = rows[0] || []`.
   - Tiêu chí thiếu cột: `existingHeaders.length < expectedHeaders.length` HOẶC ô cuối cùng `existingHeaders[existingHeaders.length - 1] !== 'Folder Link'`.
   - Khi phát hiện thiếu: ghi bổ sung 'Folder Link' vào ô kế tiếp của dòng 1.
3. **Cơ chế Backfill dữ liệu & Tối ưu Quota**:
   - Đọc dữ liệu từ `A2:Z`. Với mỗi dòng cũ, kiểm tra ô tại vị trí cột 'Folder Link':
     - Nếu đã có link (bắt đầu bằng `https://drive.google.com/drive/folders/`) → giữ nguyên (idempotent).
     - Nếu chưa có link: trích xuất `keyValue` (từ key field hoặc tên sản phẩm), gọi `findOrCreateFolder(keyValue, catFolderId)`.
   - **Chống gọi trùng lặp Drive API**: Tận dụng cache 24h sẵn có trong `src/shared/lib/drive.ts:10-33` (`_folderCache` và `localStorage`) + `Map` trong-phiên (`localFolderMap`) để tái sử dụng ngay lập tức giữa các dòng có cùng keyValue.
   - **Tối ưu Sheets API (Single-column update)**: Gom toàn bộ mảng giá trị Folder Link của các dòng thành mảng 2 chiều cột `[[link1], [link2], ...]`, ghi bằng **1 lệnh PUT duy nhất**: `${sheetTitle}!${colLetter}2:${colLetter}${rows.length + 1}`.
4. **Bảo toàn dữ liệu trong `updateProduct`**:
   - Khi gọi `updateProduct`, đọc giá trị hiện tại của Folder Link từ dòng cũ:
     - Nếu đã có: chèn nguyên vẹn vào cuối mảng `row`.
     - Nếu chưa có (dòng cũ chưa qua backfill): chủ động resolve `keyFolderId` và điền URL folder vào cuối `row` ngay lúc update.
5. **Race condition**: Nếu số dòng thực tế thay đổi giữa lúc đọc snapshot và lúc PUT dải cột (do user thêm/sửa sản phẩm đúng lúc migration chạy), có rủi ro ghép sai hàng. Đã đánh giá xác suất thấp — QUYẾT ĐỊNH CHẤP NHẬN rủi ro này, không thêm safety-check.
6. Chạy hoàn toàn âm thầm, không toast UI, chỉ console.log/flushCloudLogs nếu lỗi.

## Rationale
Cột 'Folder Link' chỉ phục vụ người dùng xem trực tiếp trên Google Sheet — UI của ImageSnap không đọc/hiển thị cột này. Block UI lúc khởi động (Option A) không cần thiết và gây trải nghiệm xấu. Chạy tuần tự đồng bộ trước khi trả dữ liệu (Option A) hoặc tách 2 pha (Option C) đều phức tạp/kém hiệu quả hơn so với chạy nền hoàn toàn không chặn UI kết hợp gom lệnh ghi dải cột.

## Options Considered
| Option | Pros | Cons | Verdict |
|---|---|---|---|
| A — Synchronous Blocking Sequence | Đơn giản, đảm bảo dữ liệu đồng bộ ngay lập tức | Chậm mở app, nguy cơ cao chạm Google API rate-limit | ❌ Rejected |
| B — Background Fire-and-Forget Worker | Mở app tức thì, gom dải cột tốn O(1) Sheets call, an toàn quota | Google Sheet có thể mất vài giây để cập nhật xong; rủi ro race condition hiếm (đã chấp nhận) | ✅ Chosen |
| C — Two-Phase Hybrid (Sync Header + Async Data) | Header có ngay, data backfill ngầm | Tách rời 2 pha, code phức tạp hơn Option B | ❌ Rejected |

## Consequences
**Positive**: App khởi động tức thì 0ms overhead; Sheet category được chuẩn hóa tự động; số lượng API calls giảm thiểu tối đa (1 call header + 1 call range values per category); an toàn tuyệt đối với cấu trúc cột của `dataService.ts`.
**Trade-offs**: Cần thêm helper hàm tính chữ cái cột Sheet (`indexToColumnLetter`) và quản lý lỗi ngầm (silent error logging).
**Risks**: Race condition hiếm gặp nếu user ghi dữ liệu đúng lúc migration đang backfill dải cột (đã chấp nhận, không mitigate).
