---
id: changelog_extension_google_auth_parity_20260904
type: changelog
title: "Extension Google Auth Parity + Rebuild Entry Point (F-004)"
tags: [auth, extension, google-oauth, refresh-token, build-fix, chrome-cookies]
keywords: [chrome.identity, launchWebAuthFlow, response_type, exchange-code, refresh-token, chrome.cookies, X-Imagesnap-Session, main.tsx, App.tsx, AppDashboard.tsx, useAuthFlow.ts, build:ext]
status: active
created: 2026-09-04
updated: 2026-09-04
summary: "Extension Chrome giờ dùng Authorization Code flow + refresh_token server-side như PWA (ADR-003, amend ADR-001); đồng thời phục hồi entry point build extension (main.tsx/App.tsx/AppDashboard.tsx/useAuthFlow.ts) đã bị xóa nhầm ở commit 7d8b7d7 (2026-08-24), khiến npm run build:ext fail suốt ~1.5 tháng."
---

## Extension Google Auth Parity + Rebuild Entry Point (2026-09-04)

### Vấn đề

Hai lỗi lồng nhau, phát hiện khi user báo "extension chưa lưu được Google
credential như PWA":

1. **Auth parity gap**: extension dùng implicit OAuth flow
   (`response_type=token` qua `chrome.identity.launchWebAuthFlow`) — access
   token sống ~1h, không có refresh_token, user bị force-logout liên tục.
   ADR-001 (2026-08-07) cố ý loại extension khỏi scope refresh_token.
2. **Build đã fail từ 2026-08-24**: commit `7d8b7d7` ("PWA Dashboard Token
   Refresh Fix", xem `pwa-dashboard-token-refresh-fix.md`) xóa
   `src/web/main.tsx`, `App.tsx`, `AppDashboard.tsx`, `hooks/useAuthFlow.ts`
   với lý do "dead Vite SPA code, không còn file nào trong `app/`/`src/extension/`
   import tới" — **kết luận đó sai**: `src/extension/index.html` vẫn trỏ
   `<script src="../web/main.tsx">`, tức `vite.ext.config.ts` (build script
   riêng cho extension, tách biệt khỏi `vite.config.ts` đã xóa cùng đợt) vẫn
   phụ thuộc trực tiếp vào `main.tsx`. `npm run build:ext` đã fail âm thầm
   suốt ~1.5 tháng cho tới khi phát hiện lần này; bundle `dist-ext/popup.js`
   đang chạy trên máy user là bản build cũ từ 2026-06-06, chưa từng rebuild
   sau các thay đổi auth của PWA.

### Thay đổi

- **Phục hồi 4 file entry point** từ `7d8b7d7^` (`git show`): `src/web/main.tsx`,
  `App.tsx`, `components/AppDashboard.tsx`, `hooks/useAuthFlow.ts`. Riêng
  `useAuthFlow.ts`: xóa nhánh PWA-only `pwaRestoreFromLocalStorage()` (dùng
  `requestSilentToken` — hàm đã bị xóa khỏi `google-auth.ts` ở đợt F-001/F-002)
  vì file này giờ CHỈ được extension dùng.
- **`src/shared/lib/google-auth.ts`** (nhánh `chrome.identity`, KHÔNG đụng
  nhánh web): `requestToken()` đổi `response_type=token` → `response_type=code`
  + `access_type=offline`; thêm `exchangeExtensionCode()` (POST
  `/api/auth/exchange-code`, tái dùng endpoint PWA) và
  `getExtensionSessionHeader()` (đọc cookie `imagesnap_session` qua
  `chrome.cookies.get()`, trả header `X-Imagesnap-Session`).
- **`app/api/auth/refresh-token/route.ts`**: đọc header `X-Imagesnap-Session`
  trước (validate `Origin` bắt đầu `chrome-extension://`), fallback cookie
  tiêu chuẩn nếu không có header — additive, không đổi hành vi nhánh cookie
  cũ dùng bởi web/PWA.
- **`src/extension/manifest.json`**: thêm permission `"cookies"`.
- **`docs/CHROME_STORE_JUSTIFICATIONS.md`**: giải thích lý do cần permission
  `cookies` (đọc cookie session của domain riêng, không phải bên thứ 3).
- **ADR-003** (mới, amend ADR-001): quyết định dùng `chrome.cookies` + header
  thay vì nới `SameSite=none` (ảnh hưởng cookie mọi client) hoặc bearer token
  riêng (trùng lặp logic session).

### Xác nhận

`npm run build:ext` và `npm run build` (Next.js) đều exit 0. Full re-run toàn
bộ 14 task qua 3 batch (không rút mẫu — batch 2 chạm HOT FILE `google-auth.ts`
19 consumer + đổi contract API, batch 3 là batch cuối). Deviation hợp lý ở
T-0036: `AppDashboard.tsx`/`App.tsx` (restore từ trước commit `03fd4c7`
edit-data-record) thiếu prop `onUpdate` mà `DataTab.tsx` hiện tại yêu cầu —
đã bổ sung `handleUpdateProduct` xuyên suốt `useAppData → App.tsx →
AppDashboard.tsx → DataTab`, xác nhận `useAppData.ts` đã export sẵn hàm này.

### Kiến trúc

ADR-003 (amends ADR-001) — xem `docs/adr/ADR-003-extension-oauth-code-flow-chrome-cookies.md`.

**Bài học chính**: kết luận "an toàn để xóa" trong
`pwa-dashboard-token-refresh-fix.md` (2026-08-24) chỉ grep trong `app/` và
`src/extension/` ở dạng import trực tiếp `.tsx`, bỏ sót tham chiếu gián tiếp
qua `<script src="...">` trong `index.html` — build script riêng
(`vite.ext.config.ts`) trỏ tới 1 entry HTML khác hoàn toàn với route Next.js.
Khi 1 project có nhiều entrypoint/build config song song (Next.js `app/` +
Vite SPA cho extension), xác nhận "không còn ai dùng" phải kiểm TẤT CẢ
`*.config.ts`/`*.html` script tag, không chỉ import TypeScript.
