# Pending TODO — ImageSnap

_Last updated: 2026-06-06 | v1.11.10_

---

## 🔴 SYSTEM LOCK — Cần split trước khi sửa

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
- [ ] PrivacyPolicy — dark theme (đã fix, chưa test thực tế)

---

## 🟢 ĐÃ HOÀN THÀNH (session 2026-06-06)

### BurstCamera split + fixes
- [x] `BurstCamera.tsx` 291→60 dòng: `useBurstCamera.ts`, `BurstCameraOverlay.tsx`
- [x] Fix `text-bg` → `text-white` ở 4 điểm trong BurstCamera (trigger + 3 overlay buttons)
- [x] `PrivacyPolicy.tsx` — wrap `PublicPageShell`, bỏ `bg-bg` + 6x `text-white` hardcode

### Màu sắc đã kiểm tra sạch
- [x] `StaffLogin.tsx` — không có màu hardcode
- [x] `CategoryEditor.tsx` — glass effects intentional (`bg-white/5`, `bg-black/80`)
- [x] `ImagePicker.tsx` — dark modal overlay intentional

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
- [x] `PrivacyPolicy.tsx` — dùng PublicPageShell, bỏ hardcode

### Split & Refactor
- [x] `DataTab.tsx` 597→198 dòng: `DataSearchBar`, `DataProductCard`, `DataProductDetail`
- [x] `CaptureTab.tsx` 537→202 dòng: `useCaptureState`, `CaptureFormFields`, `CaptureQuickAddModal`
- [x] `BurstCamera.tsx` 291→60 dòng: `useBurstCamera`, `BurstCameraOverlay`
- [x] Data grid/list layout toggle — persist localStorage

### Bug fixes
- [x] Contrast white-on-white: DataProductCard, DataProductDetail, DataTab, SettingsTab, HelpTab
- [x] Font sizes PWA: label-meta 11→13px, input text-base (16px, tránh iOS zoom)
- [x] Category pill text: text-muted → text-ink (inactive state)
- [x] Landing page dark theme tách khỏi CSS variable bg-bg
- [x] BurstCamera overlay buttons: text-bg → text-white (4 điểm)
- [x] PrivacyPolicy: white-on-light-bg → PublicPageShell dark theme

### Version
- [x] v1.11.9 → v1.11.10
