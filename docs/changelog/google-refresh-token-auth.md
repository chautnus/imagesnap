---
id: changelog_google_refresh_token_auth_20260807
type: changelog
title: "Google OAuth Authorization Code flow + server-side refresh_token (F-001)"
tags: [auth, security, database, api, pwa, google-oauth]
keywords: [refresh_token, authorization code flow, AES-256-GCM, oauth2.googleapis.com, exchange-code, session cookie, PWA login persistence]
status: active
created: 2026-08-07
updated: 2026-08-07
summary: "PWA login Google giờ giữ được 30 ngày, không còn ép đăng nhập lại khi access token 1h hết hạn. Đổi sang Authorization Code flow + refresh_token mã hoá server-side (Postgres). Chrome Extension không đổi."
---

## Google OAuth Refresh Token Auth (2026-08-07)

### Vấn đề

PWA dùng OAuth2 implicit flow (`response_type=token`) — access token Google chỉ
sống ~1h, không có refresh_token. Khi hết hạn, `reauthenticate()` chủ động revoke
session và ép user đăng nhập lại thủ công, dù cookie session 30 ngày còn hiệu lực.

### Thay đổi

- **`src/db-postgres.ts`**: thêm cột `google_refresh_token`, `google_refresh_token_iv`
  vào bảng `users` (self-healing migration).
- **`src/shared/lib/token-crypto.ts`** (mới): `encryptToken`/`decryptToken` AES-256-GCM,
  key từ env `AUTH_ENCRYPTION_KEY` (32-byte hex).
- **`app/api/auth/exchange-code/route.ts`** (mới, `POST`): đổi authorization `code`
  lấy `{access_token, refresh_token}` từ Google, mã hoá + lưu refresh_token vào
  Postgres, set cookie session (không chứa token thô), trả `access_token` cho client.
- **`app/api/auth/refresh-token/route.ts`** (mới, `GET`): dùng refresh_token đã lưu
  để mint access_token mới on-demand, không cần tương tác người dùng. `invalid_grant`
  (refresh_token bị revoke) → xoá khỏi DB, trả 401 để client route về login.
- **`src/shared/lib/google-auth.ts`**: nhánh web (`window.location.href`) chuyển
  sang `response_type=code&access_type=offline`; nhánh Chrome Extension
  (`chrome.identity.launchWebAuthFlow`) **giữ nguyên** `response_type=token`
  — ngoài scope, không đổi. Xoá `requestSilentToken()` (GIS-based) và
  `reauthenticate()` không còn tự `revokeToken()` — chỉ dispatch `SYS_AUTH_EXPIRED`.
- **`app/auth/callback/page.tsx`**: đọc `code` từ query string (không còn URL
  fragment), gọi `/api/auth/exchange-code`.
- **`src/web/hooks/useAuthFlow.ts`**: `restoreSession()` gọi
  `GET /api/auth/refresh-token` để mint access_token mới; xoá hoàn toàn nhánh
  fallback `ps_pwa_token`/`ps_pwa_email` trong `localStorage`.
- **`app/api/auth/session/route.ts`**: cookie `imagesnap_session` không còn chứa
  access_token thô — chỉ `email/role/masterSpreadsheetId/expires`.

### Bảo mật

refresh_token không bao giờ rời server: không xuất hiện trong bất kỳ response
JSON, cookie, hay localStorage nào phía client — xác nhận thủ công tại
validate-execution (2026-08-07).

### Việc cần làm thủ công trước khi deploy production

- Thêm `GOOGLE_CLIENT_SECRET` (lấy từ Google Cloud Console, OAuth Client
  `271749541534-...`) vào env production.
- Sinh và thêm `AUTH_ENCRYPTION_KEY` (32-byte hex,
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  vào env production. Thiếu 1 trong 2 biến → route exchange-code/refresh-token
  trả lỗi 500.

### Dọn code còn sót

`establishSession()` trong `google-auth.ts` không còn caller nào sau thay đổi
này (callback page không gọi nữa) — để nguyên theo đúng scope đã chốt trong
ADR-001, cân nhắc xoá ở lần dọn dead-code sau.

### Kiến trúc

Xem [ADR-001](../adr/ADR-001-google-oauth-refresh-token.md) — quyết định
Authorization Code flow + refresh_token server-side thay vì proxy toàn bộ API
(Option B) hoặc tiếp tục GIS silent re-auth (Option C, đã chứng minh thất bại
trên PWA/iOS).
