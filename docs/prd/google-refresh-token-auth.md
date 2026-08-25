# PRD: Google Refresh Token Auth

**Feature ID:** F-001 | **Slug:** google-refresh-token-auth | **Version:** 1.0 | **Date:** 2026-08-07

## Overview

**Problem**
PWA dùng OAuth2 implicit flow (`response_type=token`) — access token Google chỉ sống
~1 giờ và không có refresh_token. Khi token hết hạn, `reauthenticate()`
(`src/shared/lib/google-auth.ts:314`) chủ động revoke session và ép user đăng nhập
lại thủ công qua màn hình consent Google, dù cookie session 30 ngày vẫn còn hợp lệ.

**Success Metrics**
- User đăng nhập Google 1 lần → không phải re-consent trong 30 ngày liên tục
  (trừ khi logout / thu hồi quyền truy cập từ phía Google).
- 0 lần access_token hoặc refresh_token xuất hiện trong client-side JS,
  localStorage, hoặc response JSON gửi ra browser.

## JTBD

**User:** Cá nhân dùng ImageSnap PWA (add to homescreen) để capture ảnh vào Google
Sheets/Drive.

> Khi mở lại PWA sau khi access token Google hết hạn, tôi muốn app tự lấy token
> mới bằng refresh_token ở server, không cần tôi bấm đăng nhập lại, để tiếp tục
> công việc ngay.

## User Stories

- **US-001**: As a PWA user, tôi đăng nhập Google một lần thì ở trạng thái đăng
  nhập tối đa 30 ngày, kể cả khi access token 1h hết hạn nhiều lần trong lúc đó.
- **US-002**: As a PWA user, khi refresh_token cũng hết hiệu lực hoặc bị thu hồi
  (revoke từ Google Account settings), tôi được đưa về màn hình login rõ ràng,
  không phải gặp lỗi âm thầm hay treo app.
- **US-003**: As dev/admin, refresh_token không bao giờ xuất hiện trong
  client-side JS, localStorage, hay bất kỳ response JSON nào trả về browser.

## Scope

**In Scope**
- Đổi OAuth flow web/PWA: `response_type=token` (implicit) → `response_type=code`
  (Authorization Code flow)
- Route backend mới: exchange `code` → `{access_token, refresh_token}` qua Google
  token endpoint (`https://oauth2.googleapis.com/token`), cần `GOOGLE_CLIENT_SECRET`
  (server-only env var, chưa tồn tại trong `.env.example` hiện tại)
- Lưu `refresh_token` mã hoá tại-rest trong bảng `users` (Postgres,
  `src/db-postgres.ts`) — cột mới, không lưu ở client
- Endpoint "silent refresh" server-side: dùng refresh_token đổi access_token mới
  khi access token hết hạn; client gọi khi API trả 401
- Cập nhật `app/api/auth/session/route.ts`: cookie session không còn giữ
  access_token thô — chỉ email/role; access_token lấy on-demand từ server qua
  refresh_token
- Deprecate/xoá: `reauthenticate()` (force-logout path), `requestSilentToken()`
  (GIS-based silent refresh không còn cần), nhánh lưu `ps_pwa_token` trong
  localStorage ở `useAuthFlow.ts`

**Out of Scope**
- Chrome Extension flow — đã dùng `chrome.identity.getAuthToken` với silent
  refresh tự động của Chrome, không đụng vào
- Đổi/thêm provider đăng nhập khác ngoài Google
- UI quản lý multi-device session

## Dependencies / Constraints

- Next.js App Router — route hiện có `app/api/auth/session/route.ts`
- Postgres qua `src/db-postgres.ts`, bảng `users` (cần migration thêm cột
  `google_refresh_token`, `google_refresh_token_iv`)
- `redirect_uri` hiện tại trỏ `/auth/callback` — cần route xử lý code exchange
  (hiện `app/auth/callback/page.tsx` chỉ xử lý implicit flow trên client, cần
  đổi hướng xử lý qua server)
- Google Cloud Console: OAuth Client hiện tại (`271749541534-...`) phải được
  cấu hình đúng cho Authorization Code flow (client secret, authorized redirect
  URIs) — user tự lấy Client Secret từ Google Cloud Console, không thể tự động hoá
- Không được phá vỡ luồng Chrome Extension đang hoạt động

## Non-Functional Requirements

- **Security**: refresh_token mã hoá at-rest (AES-256-GCM), chỉ đọc/ghi từ
  server-side code, không log ra console/error tracker
- **Reliability**: refresh endpoint phải xử lý được refresh_token invalid/revoked
  → trả lỗi rõ ràng để client route về login, không loop vô hạn
- **Compatibility**: user đang có session cũ (implicit-flow) tự hết hạn tự nhiên
  sau 30 ngày, không cần migrate hàng loạt — cho phép 2 flow tồn tại song song
  trong giai đoạn chuyển tiếp
