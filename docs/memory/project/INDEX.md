# Project Memory Index

| id | summary | tags | status | file |
|----|---------|------|--------|------|
| proj_data_loss_fix_20260516 | Fixed 3 root causes of category/data loss: API error swallowing in getSheetRows, false-empty init in useAppData, and staff workspace misalignment on fresh devices. | data-integrity, sheets, staff-auth | active | [data_loss_fix_20260516.md](data_loss_fix_20260516.md) |
| proj_vercel_env_audit_20260807 | Rà soát Vercel env đối chiếu process.env.* trong code sau F-001. Phát hiện LEMON_SQUEEZY_STORE_ID thiếu trên Vercel + APP_URL vs NEXT_PUBLIC_APP_URL lệch tên — user quyết định để nguyên. | env-vars, vercel, lemon-squeezy, checkout | active | [vercel_env_audit_20260807.md](vercel_env_audit_20260807.md) |
| extension-google-auth-parity-arch | ADR-003 (amends ADR-001): extension đổi response_type=token→code, tái dùng exchange-code/refresh-token của PWA; cookie cross-origin giải quyết bằng chrome.cookies + header X-Imagesnap-Session thay vì nới SameSite hay bearer token riêng. Root cause phụ: entry point build extension bị xóa nhầm ở 7d8b7d7 (2026-08-24), build:ext fail ~1.5 tháng. | auth, extension, google-oauth, chrome-cookies, architecture | active | [extension-google-auth-parity-arch.md](extension-google-auth-parity-arch.md) |
