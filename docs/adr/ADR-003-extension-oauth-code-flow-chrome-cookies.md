---
id: ADR-003
title: "Extension Google OAuth Authorization Code Flow + Cookie qua chrome.cookies API"
status: accepted
date: 2026-09-04
tags: [auth, extension, google-oauth, security, chrome-cookies]
summary: "Extension chuyển sang response_type=code, tái dùng exchange-code/refresh-token của PWA; vượt rào cản cookie cross-origin bằng chrome.cookies API thay vì nới SameSite hay tạo token type mới."
---

## Context
ADR-001 cố ý loại Chrome Extension khỏi scope refresh_token, giữ nguyên
`response_type=token` (implicit) cho extension — hệ quả: access_token extension
chỉ sống ~1h, không refresh được, user bị force-logout liên tục (khác PWA đã
có 30-ngày session từ ADR-001). Thêm vào đó, entry point build extension
(`src/web/main.tsx` → `App.tsx` → `AppDashboard.tsx` → `hooks/useAuthFlow.ts`)
đã bị xóa nhầm ở commit `7d8b7d7` khi dọn dead code Vite SPA cho PWA — cần
phục hồi trước khi triển khai auth mới. Nếu đổi extension sang Authorization
Code flow như PWA, endpoint `/api/auth/refresh-token` xác thực qua cookie
`imagesnap_session` (`sameSite: "lax"`) — nhưng cookie SameSite=Lax KHÔNG được
gửi kèm cross-site subresource fetch (chrome-extension:// → www.imagesnap.cloud
luôn là cross-site), nên refresh sẽ luôn 401 nếu không xử lý riêng.

## Decision
Extension đổi `chrome.identity.launchWebAuthFlow` từ `response_type=token`
sang `response_type=code`, gọi `/api/auth/exchange-code` giống PWA (nhận
`access_token` trực tiếp từ response body — không phụ thuộc cookie ở bước
này). Để gọi `/api/auth/refresh-token`, extension dùng `chrome.cookies.get()`
đọc giá trị `imagesnap_session` (extension có quyền đọc cookie httpOnly của
domain đã khai báo `host_permissions`), gắn vào header `X-Imagesnap-Session`
khi fetch. Server (`refresh-token/route.ts`) đọc header này trước, fallback về
cookie tiêu chuẩn nếu không có header — không đổi SameSite, không thêm loại
token mới. Server validate `Origin` bắt đầu bằng `chrome-extension://` khi có
header này, tránh giả mạo header từ web thường. Đồng thời phục hồi 4 file
entry point từ `7d8b7d7^` (`main.tsx`, `App.tsx`, `AppDashboard.tsx`,
`useAuthFlow.ts`), bỏ reference `requestSilentToken` (đã bị xóa khỏi
`google-auth.ts` ở đợt refactor PWA). Thêm permission `"cookies"` vào
`manifest.json`. ADR này AMEND ADR-001 — xóa dòng loại trừ extension khỏi
scope; nội dung gốc ADR-001 giữ nguyên, không ghi đè.

## Rationale
Option B (đọc cookie qua `chrome.cookies` + header) tái dùng 100% cơ chế
session/mã hoá refresh_token đã có ở ADR-001, không nới SameSite (tránh tăng
bề mặt CSRF cho web/PWA — vi phạm NFR "không phá luồng PWA" trong PRD), và
không tạo loại token thứ hai cần bảo trì song song (đúng nguyên tắc "không
vault riêng" đã chốt ở bước ideate).

## Options Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| A: Nới SameSite=none + CORS allowlist | Không cần code mới | Ảnh hưởng cookie của MỌI client, tăng CSRF surface, phá nguyên tắc "không đổi luồng PWA" | ❌ Rejected |
| B: chrome.cookies API + header fallback | Tái dùng nguyên session model, không đổi SameSite, không ảnh hưởng web | Cần thêm permission `cookies`, thêm 1 bước đọc cookie thủ công | ✅ Chosen |
| C: Bearer token riêng cho extension | Tách bạch rõ 2 luồng auth | Thêm hẳn 1 loại session cần issue/validate/revoke riêng, trùng lặp logic | ❌ Rejected |

## Consequences
Positive: Extension đạt parity với PWA (30 ngày session, không force-logout);
tái dùng 100% hạ tầng Postgres/mã hoá đã kiểm chứng; `npm run build:ext` hoạt
động trở lại; không ảnh hưởng bảo mật cookie của web/PWA.
Trade-offs: Extension cần thêm permission `"cookies"` (Chrome Web Store review
có thể hỏi lý do — cập nhật `CHROME_STORE_JUSTIFICATIONS.md`); route
`refresh-token` có thêm 1 nhánh đọc header cần validate Origin cẩn thận để
không tạo lỗ hổng.
Risks: Nếu Google thay đổi cách `launchWebAuthFlow` trả `code`, cần cập nhật
lại; nếu `AUTH_ENCRYPTION_KEY` mất (rủi ro đã ghi nhận ở ADR-001) — ảnh hưởng
cả web lẫn extension như nhau.

## Amendment note cho ADR-001
File `docs/adr/ADR-001-google-oauth-refresh-token.md` cần thêm section mới ở
CUỐI file (sau "## Consequences", KHÔNG sửa nội dung gốc phía trên):
```
## Amendment (2026-09-04, xem ADR-003)
Dòng "Nhánh Chrome Extension... GIỮ NGUYÊN response_type=token — ngoài scope"
ở mục Decision đã lỗi thời. ADR-003 đưa extension vào scope: đổi sang
response_type=code, tái dùng exchange-code/refresh-token, xác thực qua
header X-Imagesnap-Session (chrome.cookies) thay vì cookie tự động.
```
