# Antigravity Calibration — thống kê chất lượng thực thi per batch
Mục đích: plan-tasks đọc để chỉnh cỡ batch (ADR-002). Lỗi dồn CUỐI batch → batch
đang quá dài, cắt nhỏ lại. Nhiều batch bé pass sạch liên tục → gộp to hơn được.

| date | slug | batch | tasks | files | fails | vị trí fail | loại lỗi | note |
|------|------|-------|-------|-------|-------|------------|----------|------|
| 2026-08-07 | google-refresh-token-auth | 1/1 | 10 | 9 | 0 | - | - | 10 task, 9 file thay đổi, pass sạch toàn bộ, kể cả điểm nhạy (tách authUrl web/extension) |
| 2026-08-24 | pwa-dashboard-token-refresh-fix | 1/1 | 3 | 10 | 0 | - | - | 3 task, 10 file thay đổi (2 sửa + 8 xoá dead code), pass sạch qua MCP; feature này chính là fix cho lỗ hổng scope của F-001 (route /dashboard thật chưa từng được wiring) |
