# Pending TODO — ImageSnap

_Last updated: 2026-06-06 | v1.11.10_

---

## 🔴 SYSTEM LOCK — Cần split trước khi sửa

### BurstCamera.tsx (291 dòng)
**Vấn đề cần sửa sau split:**
- Dòng 193: `text-bg` → `text-white` (trigger button khi camera active)
- Dòng 265, 268, 272: `text-bg` → `text-white` (overlay buttons: grid, aspect, torch khi active)

**Kế hoạch split đã phê duyệt:**
```
useBurstCamera.ts       (~130 dòng)  — state, refs, tất cả handlers
BurstCameraOverlay.tsx  (~95 dòng)   — fullscreen overlay JSX
BurstCamera.tsx         (~45 dòng)   — trigger button + compose
```
**Thực thi:** `/split-execute src/web/components/BurstCamera.tsx "Tạo useBurstCamera.ts chứa toàn bộ state, refs, useEffect và handlers. Tạo BurstCameraOverlay.tsx chứa fullscreen camera overlay JSX. BurstCamera.tsx giữ trigger button và compose."`

---

### UserDirectory.tsx (266 dòng)
**Cần kiểm tra:** Có thể có màu hardcode dark mode (`text-white`, `bg-black`, v.v.)
**Hành động:** Chạy `/split-plan` nếu cần sửa nội dung.

---

## 🟡 CẦN KIỂM TRA / VERIFY

### Giao diện cần test thực tế sau redesign
- [ ] PWA trên Android — CaptureTab layout, font sizes
- [ ] Extension side-panel — Header, Navigation, CaptureTab
- [ ] Trang chủ (landing page) — dark theme stable sau refactor theme.ts
- [ ] Blog / Use-case pages — dark theme qua PublicPageShell + SEOPage
- [ ] Pricing page — dark theme
- [ ] Login modal — dark theme

### Màu sắc còn nghi ngờ
- [ ] `StaffLogin.tsx` — chưa kiểm tra, có thể còn dark mode colors
- [ ] `PrivacyPolicy.tsx` — chưa kiểm tra, có thể còn dark mode colors
- [ ] `CategoryEditor.tsx` (234 dòng) — chưa kiểm tra colors
- [ ] `ImagePicker.tsx` (132 dòng) — chưa kiểm tra colors

---

## 🟢 ĐÃ HOÀN THÀNH (session 2026-06-06)

### Performance
- [x] Drive folder cache 24h (localStorage + Map) — tiết kiệm 1-2 API call/save
- [x] Base64 decode qua `fetch(dataUrl)` — ~10x nhanh hơn charCodeAt loop
- [x] Parallel image upload — `Promise.all` thay for-loop sequential

### Redesign Light Mode
- [x] `index.css` — palette mới (indigo #4F6EF7, bg #F0F4FF, card white)
- [x] `Navigation.tsx` — pill active, sentence case, strokeWidth dynamic
- [x] `Header.tsx` — simplified, emerald sync dot
- [x] `SettingsTab.tsx` — clean light mode
- [x] `HelpTab.tsx` — clean light mode

### Theme tập trung
- [x] `src/web/styles/theme.ts` — file duy nhất cho mọi màu (PUB + APP)
- [x] `PublicPageShell.tsx` — dark wrapper cho mọi public page
- [x] `SEOPage.tsx` — wrap PublicPageShell → fix tất cả 15+ blog/alt/tools
- [x] `LandingPage`, `PricingPage`, `BlogPage` — dùng theme.ts
- [x] `PublicHeader`, `PublicFooter`, `LoginModal` — dùng theme.ts

### Split & Refactor
- [x] `DataTab.tsx` 597→198 dòng: `DataSearchBar`, `DataProductCard`, `DataProductDetail`
- [x] `CaptureTab.tsx` 537→202 dòng: `useCaptureState`, `CaptureFormFields`, `CaptureQuickAddModal`
- [x] Data grid/list layout toggle — persist localStorage

### Bug fixes
- [x] Contrast white-on-white: DataProductCard, DataProductDetail, DataTab, SettingsTab, HelpTab
- [x] Font sizes PWA: label-meta 11→13px, input text-base (16px, tránh iOS zoom)
- [x] Category pill text: text-muted → text-ink (inactive state)
- [x] Landing page dark theme tách khỏi CSS variable bg-bg

### Version
- [x] v1.11.9 → v1.11.10
