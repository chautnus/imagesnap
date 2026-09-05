---
id: prd_extension-google-auth-parity_20260904
title: "Extension Google Auth Parity + Rebuild Entry Point"
status: draft
version: 1.0
author: chautnus
created: 2026-09-04
updated: 2026-09-04
tags: [auth, extension, google-oauth, refresh-token, build-fix]
summary: "Phục hồi entry point extension đã bị xóa nhầm và chuyển sang Authorization Code flow để extension có refresh_token bền vững như PWA."
---

# PRD: Extension Google Auth Parity + Rebuild Entry Point

## 1. Overview
**Problem**: Extension Chrome dùng implicit OAuth flow (`response_type=token`) — access_token sống ~1h, không có refresh_token, user bị force logout liên tục. Nghiêm trọng hơn: entry point build extension (`src/web/main.tsx`, `App.tsx`, `AppDashboard.tsx`, `hooks/useAuthFlow.ts`) đã bị xóa nhầm ở commit `7d8b7d7` khi dọn "dead Vite SPA code" cho PWA (2026-08-24) — `npm run build:ext` hiện tại FAIL hoàn toàn.

**Solution**: (1) Phục hồi 4 file entry point từ git history (`7d8b7d7^`), adapt lại theo API `google-auth.ts` hiện tại (bỏ `requestSilentToken` đã không còn tồn tại). (2) Đổi nhánh extension trong `google-auth.ts` từ `response_type=token` → `response_type=code`, tái dùng nguyên `/api/auth/exchange-code` + `/api/auth/refresh-token` đã build cho PWA (ADR-001). (3) Giải quyết vấn đề cookie cross-origin khi extension gọi các endpoint này bằng `chrome.cookies` API. (4) Amend ADR-001 để đưa extension vào scope.

**Success Metrics**: `npm run build:ext` exit code 0; user extension không bị force logout trong ≥7 ngày dùng liên tục (đối chiếu chu kỳ 30 ngày cookie session của PWA).

## 2. Background & Context
F-001 (2026-08-07, ADR-001) đã chuyển PWA sang Authorization Code flow với refresh_token mã hoá server-side, và cố ý loại nhánh Chrome Extension khỏi scope ("giữ nguyên response_type=token"). Cùng đợt refactor đó (commit `7d8b7d7`, 2026-08-24), toàn bộ Vite SPA cũ (`src/web/main.tsx`, `App.tsx`, `AppDashboard.tsx`, `hooks/useAuthFlow.ts`, `vite.config.ts`, `src/web/index.html`, `sw.ts`) bị xóa vì tưởng là dead code — nhưng `vite.ext.config.ts` (build extension, tách biệt khỏi `vite.config.ts` đã xóa) vẫn phụ thuộc `src/extension/index.html → src/web/main.tsx → App.tsx`. Extension đang chạy trên máy user (`dist-ext/popup.js`, build cuối 2026-06-06) là bundle CŨ, chưa từng rebuild từ sau khi các thay đổi auth của PWA có hiệu lực. `src/web/index.css` đã được khôi phục ở commit `a4bd860` — không cần khôi phục lại.

## 3. Jobs To Be Done (JTBD)
> **When** tôi dùng extension để browse và capture sản phẩm liên tục nhiều ngày (ecommerce research/competitor tracking), **I want to** không bị đăng xuất giữa chừng, **so I can** làm việc liên tục như trên PWA mà không mất context.

## 4. Stakeholders
| Role | Name/Team | Responsibility |
|------|-----------|----------------|
| Product Owner | chautnus | Phê duyệt PRD |
| Tech Lead | chautnus | Kiến trúc kỹ thuật (giải pháp cookie cross-origin) |
| Dev | Antigravity (executor) | Triển khai theo tasks |

## 5. User Stories & Acceptance Criteria

### US-009: Extension build lại được
**As a** dev, **I want to** `npm run build:ext` chạy thành công, **So that** tôi có thể build/release extension với auth flow mới
*(Serves JTBD: nền tảng bắt buộc trước khi triển khai auth mới)*

**Acceptance Criteria:**
- [ ] Given repo hiện tại, When chạy `npm run build:ext`, Then exit code 0, `dist-ext/popup.js` được sinh ra không lỗi
- [ ] Given `App.tsx`/`AppDashboard.tsx`/`useAuthFlow.ts` đã phục hồi, When import `google-auth.ts`, Then không còn reference tới hàm đã xóa (`requestSilentToken`)

### US-010: Extension login 1 lần, tự động refresh
**As a** extension user, **I want to** đăng nhập Google 1 lần và được tự động refresh session, **So that** tôi không phải re-authenticate mỗi ~1h
*(Serves JTBD: làm việc liên tục nhiều ngày không bị gián đoạn)*

**Acceptance Criteria:**
- [ ] Given user chưa login, When bấm đăng nhập, Then `chrome.identity.launchWebAuthFlow` dùng `response_type=code`, gọi `/api/auth/exchange-code` thành công, nhận `access_token` + lưu refresh_token mã hoá server-side (bảng `users`)
- [ ] Given access_token hết hạn (401 từ Google API), When extension gọi lại, Then tự động gọi `/api/auth/refresh-token` (kèm header `X-Imagesnap-Session`) lấy access_token mới mà KHÔNG yêu cầu user tương tác
- [ ] Given refresh_token vẫn hợp lệ, When user đóng/mở lại extension sau >1h, Then không phải đăng nhập lại

### US-011: Trạng thái "cần đăng nhập lại" thống nhất
**As a** extension user, **I want to** thấy cùng 1 màn hình đăng nhập khi refresh_token bị Google revoke hoặc khi tôi chưa từng login, **So that** trải nghiệm nhất quán, không gây nhầm lẫn giữa 2 trạng thái
*(Serves JTBD: xử lý edge case revoke quyền không làm gián đoạn UX)*

**Acceptance Criteria:**
- [ ] Given refresh_token bị Google revoke (`invalid_grant`), When `/api/auth/refresh-token` trả lỗi, Then extension coi như chưa đăng nhập (clear storage, view='landing') — giống hệt trạng thái chưa từng đăng nhập
- [ ] Given user chưa từng login, When mở extension, Then hiển thị đúng cùng màn hình login đó

## 6. Functional Requirements
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Phục hồi `main.tsx`, `App.tsx`, `AppDashboard.tsx`, `useAuthFlow.ts` từ `7d8b7d7^`, xóa reference `requestSilentToken` | Must Have | Không phục hồi `vite.config.ts`/`src/web/index.html`/`sw.ts` — không cần cho `build:ext` |
| FR-002 | `google-auth.ts` nhánh extension: `response_type=token` → `response_type=code` trong `launchWebAuthFlow` | Must Have | Giữ nguyên nhánh web (đã dùng code flow từ ADR-001) |
| FR-003 | Extension gọi `/api/auth/exchange-code` sau khi nhận `code` từ `launchWebAuthFlow` | Must Have | Tái dùng endpoint PWA, không tạo endpoint mới |
| FR-004 | Extension gọi `/api/auth/refresh-token` kèm header `X-Imagesnap-Session` khi access_token hết hạn/gặp 401 | Must Have | chrome.cookies.get() đọc cookie, gắn header thay vì dựa cookie tự động (SameSite=Lax chặn cross-site fetch) |
| FR-005 | Amend ADR-001 — bỏ dòng loại trừ extension khỏi scope | Must Have | Không ghi đè nội dung gốc, thêm addendum |
| FR-006 | Giữ nguyên `saveTokenToExtStorage`/`loadTokenFromExtStorage` cho access_token cache | Should Have | Không đổi cơ chế cache hiện có |

## 7. Non-Functional Requirements
| Category | Requirement | Metric |
|----------|-------------|--------|
| Security | refresh_token không bao giờ rời server, mã hoá AES-256-GCM (tái dùng `AUTH_ENCRYPTION_KEY`) | 0 lần refresh_token xuất hiện ở client/logs |
| Reliability | Sửa `google-auth.ts` (dùng chung web+extension+staff+dashboard) không phá luồng PWA hiện có | 0 regression trên `HomeClient.tsx`/`staff/page.tsx`/`useDashboardInit.ts`/`sheets.ts` |
| Compatibility | Redirect URI `https://fdmfidehhcbcaaaeilbabddnkdlpbhda.chromiumapp.org/` phải hoạt động với Authorization Code flow | Google OAuth consent screen không báo lỗi `redirect_uri_mismatch` |

## 8. Out of Scope
- Đổi luồng auth PWA/web hiện có (`reauthenticate()`, `useDashboardInit`)
- Dùng `chrome.identity.getAuthToken` (loại ở bước ideate — phụ thuộc Chrome profile sign-in)
- Vault mã hoá riêng trong `chrome.storage.local` (loại ở bước ideate)
- Đổi schema DB (tái dùng cột `google_refresh_token`/`_iv` có sẵn)
- Phục hồi `vite.config.ts`, `src/web/index.html`, `sw.ts` (thuộc Vite SPA cũ, không liên quan `build:ext`)

## 9. Dependencies
- `GOOGLE_CLIENT_SECRET`, `AUTH_ENCRYPTION_KEY` (env server, đã tồn tại)
- Postgres `users` table, cột `google_refresh_token`/`google_refresh_token_iv` (đã tồn tại, ADR-001)
- Google Cloud Console: OAuth Client ID hiện tại — cần xác nhận redirect URI `chromiumapp.org` đăng ký đúng cho Authorization Code flow
- `chrome.identity` permission (đã khai báo trong `manifest.json`); permission `cookies` mới cần thêm

## 10. Definition of Done (Feature-level)
- [ ] Tất cả Acceptance Criteria (US-009, US-010, US-011) đã pass
- [ ] `npm run build:ext` chạy thành công, extension load được trong Chrome (unpacked) và login/refresh hoạt động
- [ ] Regression check: luồng login PWA/web (`HomeClient.tsx`, `staff/page.tsx`) không bị ảnh hưởng
- [ ] ADR-001 đã amend
- [ ] Tài liệu (`docs/adr`, `docs/prd`, memory) đã cập nhật
- [ ] PRD status cập nhật → `approved`

## 11. Timeline
| Milestone | Date | Notes |
|-----------|------|-------|
| Elicitation + PRD | 2026-09-04 | Done |
| Architecture (ADR-003) | 2026-09-04 | Done |
| Implementation + validate | TBD | mcp-execute-plan (B1→B2→B3) |

## 12. Open Questions
- [ ] Redirect URI `chromiumapp.org` đã đăng ký cho Authorization Code flow trong Google Cloud Console chưa, hay cần thêm/verify? (không tự sửa được qua code — cần user xác nhận trong Google Cloud Console)

## 13. Changelog
| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-09-04 | chautnus | Initial draft |
