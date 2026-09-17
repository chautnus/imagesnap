---
id: changelog_cot_link_thu_muc_anh_20260917
type: changelog
title: "Thêm cột Folder Link vào Sheet + tự động migration/backfill sheet cũ (F-006)"
tags: [sheets, drive, migration, product]
keywords: [saveProduct, updateProduct, ensureSheetExists, migrateFolderLinksInBackground, backfillCategoryFolderLinks, detectAndPatchFolderLinkHeader, indexToColumnLetter, Folder Link]
status: active
created: 2026-09-17
updated: 2026-09-17
summary: "Mỗi sheet category giờ có thêm cột 'Folder Link' ở cuối, chứa URL thư mục Google Drive của bản ghi. Bản ghi mới tự có link; sheet cũ được tự động vá header + backfill link ngầm (không chặn UI) khi app khởi động."
---

## Cột Folder Link trong Sheet (2026-09-17)

### Vấn đề

Google Sheet không có cột link trực tiếp tới folder Drive chứa ảnh của từng bản ghi
— cột 'Images' chỉ chứa URL từng ảnh lẻ. Người dùng mở trực tiếp Sheet trên Drive để
tra cứu/chia sẻ phải tự tìm folder thủ công.

### Thay đổi

- **`src/shared/services/productService.ts`**:
  - `saveProduct()`: thêm header `'Folder Link'` vào cuối mảng headers, ghi giá trị
    `https://drive.google.com/drive/folders/{keyFolderId}` vào cuối `row` (tái dùng
    `keyFolderId` đã resolve sẵn).
  - `updateProduct()`: đọc dòng hiện tại (`getSheetRows A:Z`), nếu cột Folder Link đã
    có giá trị hợp lệ thì giữ nguyên; nếu chưa có (bản ghi cũ chưa qua backfill) thì
    tự `findOrCreateFolder` để điền luôn.
- **`src/shared/lib/sheets.ts`** (mới):
  - `indexToColumnLetter(index)`: chuyển chỉ số 0-based sang chữ cái cột Sheets (A, Z, AA...).
  - `detectAndPatchFolderLinkHeader()`: phát hiện sheet category thiếu cột 'Folder
    Link' ở cuối header, ghi bổ sung nếu thiếu.
  - `backfillCategoryFolderLinks()`: đọc toàn bộ dòng cũ, resolve folder qua
    `findOrCreateFolder` (dùng cache 24h sẵn có + `Map` trong-phiên chống gọi trùng),
    ghi kết quả bằng **1 lệnh PUT duy nhất** cho cả dải cột (không update từng dòng).
  - `migrateFolderLinksInBackground()`: orchestrator, chạy tuần tự cho từng category,
    chỉ backfill khi header vừa được patch; mỗi category bọc try/catch riêng.
- **`src/shared/services/dataService.ts`**: `fetchAllAppData()` gọi
  `migrateFolderLinksInBackground(...)` theo kiểu **fire-and-forget** (không `await`)
  ngay trước khi return — không chặn UI. Logic đọc positional (`r[0]`..`r[6]`,
  `r[7+fIdx]`) hoàn toàn không đổi.

### Kiến trúc

ADR-004: Background Fire-and-Forget Worker (Option B) thay vì chặn đồng bộ lúc khởi
động (Option A) hoặc tách 2 pha sync-header/async-data (Option C) — cột này chỉ phục
vụ xem trên Google Sheet, UI app không đọc nên không cần chờ. Đã đánh giá và **chấp
nhận rủi ro race condition** hiếm gặp (số dòng đổi giữa lúc đọc snapshot và lúc PUT
dải cột) — không thêm safety-check. Migration chỉ backfill giá trị khi header vừa
được patch lần đầu (không re-check mỗi lần khởi động sau đó); nếu bước PUT dải cột
lỗi giữa chừng sau khi header đã patch, lần khởi động sau sẽ KHÔNG tự retry backfill
nữa (limitation đã biết, kế thừa từ ADR, chưa cần xử lý theo yêu cầu PRD hiện tại).

### Xác nhận

Full re-run 6/6 task's verify-cmd (không rút mẫu — batch cuối + data-destructive).
Đối chiếu must-keep: thứ tự cột ID/CreatedAt/Images/Name/Tags/AuthorId/AuthorName/
...fields không đổi; `dataService.ts` dòng đọc positional nguyên vẹn (chỉ thêm 1 dòng
gọi migration fire-and-forget). Commit `060a526`, đã push lên remote `main`.
