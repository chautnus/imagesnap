---
id: ADR-001
title: "Google OAuth2 Authorization Code Flow với server-side refresh_token"
status: accepted
date: 2026-08-07
tags: [auth, security, database, api]
summary: "Chuyển từ implicit flow sang Authorization Code flow; lưu refresh_token mã hoá ở Postgres; server mint access_token on-demand cho client."
---

## Context
PWA dùng implicit flow (`response_type=token`) nên access_token Google chỉ sống
~1h và không có refresh_token. Khi hết hạn, app hiện tại force-logout user
(`reauthenticate()` ở `google-auth.ts:314`) vì GIS silent re-auth không đáng tin
cậy trên PWA/iOS (ITP browser rules). Client vẫn cần access_token thật để gọi
trực tiếp Google Sheets/Drive API (`sheets.ts:34`), nên không thể loại bỏ hoàn
toàn access_token phía client trong scope feature này.

## Decision
Đổi sang Authorization Code flow (`response_type=code`) cho nhánh web/PWA. Server
exchange code lấy `{access_token, refresh_token}` từ Google, lưu `refresh_token`
mã hoá AES-256-GCM trong cột mới `google_refresh_token` (+ `google_refresh_token_iv`)
của bảng `users` (Postgres). Thêm endpoint `GET /api/auth/refresh-token`
(cookie-authenticated qua `imagesnap_session`) — server dùng refresh_token đổi
access_token mới, trả về cho client trong response body (không set cookie chứa
access_token). Client gọi endpoint này khi khởi động app và khi API Google trả
401. Xoá `reauthenticate()` force-logout, `requestSilentToken()`, và nhánh lưu
access_token thô trong `localStorage`/cookie. Nhánh Chrome Extension
(`chrome.identity.launchWebAuthFlow`) GIỮ NGUYÊN response_type=token — ngoài scope.

## Rationale
Option A giữ nguyên kiến trúc gọi API trực tiếp từ client (không viết lại
sheets.ts/drive.ts), đúng scope "feature 1-3 ngày" đã chốt trong PRD, và tận
dụng bảng `users` + Postgres pool sẵn có (`src/db-postgres.ts`) thay vì thêm
hạ tầng mới.

## Options Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| A: Refresh_token server-side + client vẫn gọi API trực tiếp | Scope nhỏ, tái dùng hạ tầng | access_token vẫn tạm trú ở browser (không mới) | ✅ Chosen |
| B: Proxy toàn bộ Google API qua server (BFF) | An toàn nhất | Viết lại toàn bộ data layer, vượt scope | ❌ Rejected |
| C: Tiếp tục GIS silent re-auth | Không đổi flow | Đã chứng minh không hoạt động trên PWA/iOS | ❌ Rejected |

## Consequences
Positive: User không bị ép đăng nhập lại trong 30 ngày; kiến trúc gọi API
client-side không đổi; refresh_token không bao giờ rời server.
Trade-offs: Cần `GOOGLE_CLIENT_SECRET` mới trong env (server-only); cần
migration DB thêm 2 cột; cần key mã hoá riêng (`AUTH_ENCRYPTION_KEY`) quản lý
an toàn.
Risks: Nếu `AUTH_ENCRYPTION_KEY` bị lộ hoặc mất → toàn bộ refresh_token trong
DB vô dụng, user phải đăng nhập lại hàng loạt (chấp nhận được, không mất dữ
liệu nghiệp vụ). Google có thể revoke refresh_token bất kỳ lúc nào (user tự
thu hồi quyền, hoặc Google policy) — endpoint refresh phải xử lý lỗi rõ ràng
(US-002).

## Amendment (2026-09-04, xem ADR-003)
Dòng "Nhánh Chrome Extension... GIỮ NGUYÊN response_type=token — ngoài scope"
ở mục Decision đã lỗi thời. ADR-003 đưa extension vào scope: đổi sang
response_type=code, tái dùng exchange-code/refresh-token, xác thực qua
header X-Imagesnap-Session (chrome.cookies) thay vì cookie tự động.

