# Project Memory: ImageSnap

## Project Overview (v1.11.10)
ImageSnap là nền tảng cataloging ảnh sản phẩm tốc độ cao cho e-commerce marketers. Cho phép chụp, phân loại và upload ảnh từ bất kỳ trang web hoặc camera trực tiếp lên Google Drive và Google Sheets. Hoạt động trên 3 platform chia sẻ chung `src/shared/`: PWA, Chrome Extension, Web.

---

## Current State (v1.11.10 — 2026-06-06)

### 🎨 Design System
- **Theme engine**: `src/web/styles/theme.ts` — file DUY NHẤT chứa mọi màu sắc
  - `PUB.*` — dark theme cho marketing/public pages
  - `APP.*` — light theme cho app dashboard
- **Palette app**: bg `#F0F4FF`, card `#FFFFFF`, accent `#4F6EF7` (indigo), ink `#1E293B`
- **Palette public**: bg `#0a0a0c`, text white, glass `bg-white/5`
- **PublicPageShell**: wrapper dark cho mọi public page — import từ `theme.ts`
- **Quy tắc**: KHÔNG hardcode `bg-*`, `text-*`, `border-*` trong component. Luôn dùng token từ `theme.ts` hoặc CSS vars trong `index.css`

### 📐 Font & Input Standards (PWA)
- `.input`: `text-base` (16px) — bắt buộc để tránh iOS auto-zoom
- `.label-meta`: `text-[13px]` semibold uppercase
- Category name pills: `text-[13px] text-ink` (inactive), `text-accent` (active)

### 🗂 Component Architecture
```
src/web/
  styles/theme.ts           ← Centralized color tokens (PUB + APP)
  components/
    PublicPageShell.tsx     ← Dark wrapper for all public pages
    CaptureTab.tsx          ← 202 lines (orchestrator)
    useCaptureState.ts      ← Camera state + business logic
    CaptureFormFields.tsx   ← Dynamic form fields + autocomplete
    CaptureQuickAddModal.tsx← Quick add category modal
    DataTab.tsx             ← 198 lines (orchestrator)
    DataSearchBar.tsx       ← Search input + filter panel
    DataProductCard.tsx     ← List/Grid card (layout prop)
    DataProductDetail.tsx   ← Full-screen detail view
    Header.tsx              ← App header (light theme)
    Navigation.tsx          ← Bottom nav (pill active, sentence case)
    BurstCamera.tsx         ← 60 lines (trigger + compose)
    useBurstCamera.ts       ← Camera state, refs, all handlers
    BurstCameraOverlay.tsx  ← Fullscreen overlay JSX
    PrivacyPolicy.tsx       ← Wrapped in PublicPageShell (dark)
```

### ⚡ Performance (drive.ts + productService.ts)
- Folder cache: 2-tier (Map + localStorage 24h TTL) — 0 API call từ lần 2
- Base64 decode: `fetch(dataUrl)` native — ~10x nhanh hơn charCodeAt loop
- Upload parallel: `Promise.all` — 3 ảnh từ 3× xuống ~1× latency
- setPermissions: fire-and-forget — không block return

### 🔐 Auth
- Session: 30 ngày + rolling renewal (mỗi GET /api/auth/session reset timer)
- restoreSession chạy trước initAuthListener trong App.tsx
- **Google OAuth (web/PWA)**: Authorization Code flow (`response_type=code`) —
  refresh_token mã hoá AES-256-GCM lưu ở Postgres (`users.google_refresh_token`),
  KHÔNG bao giờ rời server. `restoreSession()` mint access_token mới qua
  `GET /api/auth/refresh-token` — user không còn bị ép đăng nhập lại khi access
  token 1h hết hạn. Chi tiết: [ADR-001](adr/ADR-001-google-oauth-refresh-token.md),
  [changelog](changelog/google-refresh-token-auth.md).
- **Google OAuth (Chrome Extension)**: vẫn dùng implicit flow
  (`chrome.identity.launchWebAuthFlow`, `response_type=token`) — không đổi, tách
  biệt hoàn toàn khỏi luồng web.

---

## Pending Work
→ Xem chi tiết: [`docs/pending-todo.md`](pending-todo.md)

**Ngay bây giờ:**
- UserDirectory.tsx (266 dòng) — gần SYSTEM LOCK, cần `/split-plan` trước khi sửa

**Cần verify:**
- Test PWA trên Android, Extension side-panel
- PrivacyPolicy — đã fix theme, chưa test thực tế

---

## Project Structure

### 📁 src/shared/ (dùng chung cả 3 platform)
- `lib/drive.ts` — Google Drive API + folder cache
- `lib/sheets.ts` — Google Sheets API
- `lib/version.ts` — `APP_VERSION = 'v1.11.10'`
- `services/productService.ts` — save product (parallel upload)

### 📁 src/web/
- `styles/theme.ts` — ⭐ centralized color tokens
- `components/` — React components (xem bên trên)
- `pages/` — SEOPage (wrapper 15+ trang), PricingPage, BlogPage...
- `index.css` — CSS vars + `.btn`, `.card`, `.input`, `.label-meta`, `.glass`

### 📁 src/extension/
- `manifest.json` — version 1.11.10

### 📁 docs/
- `MEMORY.md` — file này (master index)
- `pending-todo.md` — ⭐ việc chờ làm
- `changelog/INDEX.md` — lịch sử phiên bản
- `memory/INDEX.md` — memory files index

---

## Development Rules

### SYSTEM LOCK (> 250 dòng)
Không sửa file > 250 dòng khi chưa chạy `/split-plan`. Files hiện tại cần chú ý:
- `BurstCamera.tsx` — 60 dòng ✅ (đã split)
- `UserDirectory.tsx` — 266 dòng 🟡
- `CategoryEditor.tsx` — 234 dòng ✅ (< 250, còn OK)

### Theme Rule
Mọi màu sắc → `src/web/styles/theme.ts`. Không exception.

### Upload Pattern
`findOrCreateFolder` → check cache trước, API sau. Cache key: `imgsnap_fid_${parentId}::${name}`.

---

## Domain Indexes

| Domain | Path | Index |
|--------|------|-------|
| Pending work | `docs/` | [pending-todo.md](pending-todo.md) |
| Memory (all) | `docs/memory/` | [INDEX.md](memory/INDEX.md) |
| Changelog | `docs/changelog/` | [INDEX.md](changelog/INDEX.md) |

---
*Last Updated: 2026-08-07 — Google refresh_token auth (F-001)*
- [[pwa-dashboard-token-refresh-fix-tasks](memory/project/pwa-dashboard-token-refresh-fix-tasks.md)] — task list đã confirm
- [[edit-data-record-tasks](memory/project/edit-data-record-tasks.md)] — task list đã confirm
