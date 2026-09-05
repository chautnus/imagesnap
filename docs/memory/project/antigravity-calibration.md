# Antigravity Calibration — thống kê chất lượng thực thi per batch
Mục đích: plan-tasks đọc để chỉnh cỡ batch (ADR-002). Lỗi dồn CUỐI batch → batch
đang quá dài, cắt nhỏ lại. Nhiều batch bé pass sạch liên tục → gộp to hơn được.

| date | slug | batch | tasks | files | fails | vị trí fail | loại lỗi | note |
|------|------|-------|-------|-------|-------|------------|----------|------|
| 2026-08-07 | google-refresh-token-auth | 1/1 | 10 | 9 | 0 | - | - | 10 task, 9 file thay đổi, pass sạch toàn bộ, kể cả điểm nhạy (tách authUrl web/extension) |
| 2026-08-24 | pwa-dashboard-token-refresh-fix | 1/1 | 3 | 10 | 0 | - | - | 3 task, 10 file thay đổi (2 sửa + 8 xoá dead code), pass sạch qua MCP; feature này chính là fix cho lỗ hổng scope của F-001 (route /dashboard thật chưa từng được wiring) |
| 2026-08-29 | edit-data-record | 1/1 | 9 | 7 | 0 | - | - | 9 task, 7 file thay đổi (1 file mới EditProductForm.tsx), pass sạch full re-run qua MCP; đúng áp dụng correction categoryName đã chèn trong prompt (bug tiềm ẩn ở route save-product cũ không bị lặp lại ở route update mới) |
| 2026-09-04 | extension-google-auth-parity | 1/3 | 5 | 4 | 0 | - | - | 5 task, 4 file phục hồi từ git history (7d8b7d7^, đúng commit từng xóa nhầm ở batch pwa-dashboard-token-refresh-fix 2026-08-24), pass sạch full re-run; npm run build:ext chạy lại được sau ~1.5 tháng fail |
| 2026-09-04 | extension-google-auth-parity | 2/3 | 5 | 3 | 0 | - | - | 5 task, 3 file sửa (google-auth.ts HOT FILE 19 consumer, refresh-token/route.ts đổi contract additive, manifest.json), pass sạch full re-run; nhánh web (webAuthUrl) và cookie fallback xác nhận không đổi hành vi |
