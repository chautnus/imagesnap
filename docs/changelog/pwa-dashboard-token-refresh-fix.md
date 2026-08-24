---
id: changelog_pwa_dashboard_token_refresh_fix_20260824
type: changelog
title: "PWA /dashboard route wired to refresh_token flow, dead Vite SPA code removed (F-002)"
tags: [auth, pwa, google-oauth, dead-code]
keywords: [reauthenticate, refresh_token, access_token, SYS_AUTH_EXPIRED, useDashboardInit, dashboard, PWA start_url]
status: active
created: 2026-08-24
updated: 2026-08-24
summary: "PWA (route /dashboard, start_url thật) giờ tự refresh access_token qua reauthenticate() thay vì bị mất token ngay từ đầu do đọc field session cookie không còn tồn tại. Dead code Vite SPA cũ (App.tsx/useAuthFlow.ts) đã xoá."
---

## PWA Dashboard Token Refresh Fix (2026-08-24)

### Vấn đề

F-001 (2026-08-07, refresh_token auth) chỉ sửa đúng logic `restoreSession()` ở
`src/web/hooks/useAuthFlow.ts` — code path thuộc build Vite SPA cũ, KHÔNG được
Next.js `app/` mount. Route `/dashboard` (start_url thật của PWA, xem
`public/manifest.json`) vẫn đọc `profile.token` từ session cookie — field không
còn tồn tại từ sau F-001 (cookie mới chỉ có `{email, role, masterSpreadsheetId,
expires}`) — nên access token luôn `undefined` ngay từ đầu. Đồng thời
`reauthenticate()` trong `src/shared/lib/google-auth.ts` (dùng chung bởi
`sheets.ts`, `api-client.ts`, `useDashboardInit.ts`) chỉ dispatch event
`SYS_AUTH_EXPIRED` rồi reject ngay — chưa từng gọi endpoint
`GET /api/auth/refresh-token` mà F-001 đã xây đúng ở server.

### Thay đổi

- **`src/shared/lib/google-auth.ts`**: `reauthenticate()` giờ thực sự gọi
  `GET {getApiBase()}/api/auth/refresh-token` cho web/PWA context; thành công thì
  `setAccessToken()` + trả token mới; thất bại hoặc đang chạy Chrome Extension mới
  dispatch `SYS_AUTH_EXPIRED` + reject (giữ nguyên hành vi cũ cho case extension).
- **`app/dashboard/hooks/useDashboardInit.ts`**: `handleInit()` gọi
  `await reauthenticate()` khi mount (user không phải staff) thay vì đọc
  `profile.token`.
- **Dọn dead code**: xoá `src/web/App.tsx`, `main.tsx`, `index.html`, `index.css`,
  `sw.ts`, `hooks/useAuthFlow.ts`, `components/AppDashboard.tsx`, và
  `vite.config.ts` (root) — Vite SPA entry cũ, đã xác nhận không còn build script
  nào dùng (`package.json` `build:web` thực chất là `next build`) và không còn file
  nào trong `app/`/`src/extension/` import tới. `src/web/components/*` và
  `src/web/pages/*` khác (dùng qua alias `@web/*` trong nhiều route Next.js) giữ
  nguyên, không đụng.

### Xác nhận

`npx tsc --noEmit` pass sau cả 2 thay đổi lẫn sau khi xoá dead code. Grep xác nhận
không còn tham chiếu nào tới `useAuthFlow`/`App.tsx`/`AppDashboard` trong `app/`
hay `src/extension/`. Commit `7d8b7d7`, đã push lên remote `main`.

### Kiến trúc

Không có ADR riêng (scope=small). Bài học chính: khi sửa 1 flow có nhiều
entrypoint song song (ở đây là Next.js `app/` vs Vite SPA `src/web/`), phải xác
nhận đúng entrypoint nào thực sự được build/deploy (`public/manifest.json`
`start_url`, `package.json` scripts) trước khi kết luận đã sửa xong — F-001 tự nó
pass sạch nhưng scope không bao trùm route thật.
