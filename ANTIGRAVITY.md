# ANTIGRAVITY.md — SESSION CONTEXT FILE
> File này là "bộ nhớ ngắn hạn" giữa các phiên làm việc.
> Agent PHẢI đọc file này đầu tiên (BOOT-01).
> Agent PHẢI cập nhật cuối mỗi phiên (/sync).
> **QUY TẮC TỐI THƯỢNG**: 
> 1. PHẢI đợi phê duyệt (Approval) trước khi sửa code/chạy lệnh.
> 2. PHẢI nạp và tuân thủ Tuyệt đối Chỉ dẫn hệ thống (System Instructions).

---

## Thông tin dự án
- **Project Name**: ImageSnap
- **Official Domain**: [www.imagesnap.cloud](https://www.imagesnap.cloud)
- **Status**: Active / Production Ready
- **Core Architecture**: Centralized Storage (Staff-to-Admin Proxy) / Next.js SSR
- **Deployment Platform**: Vercel (Production) / Railway (Backup/Legacy)

## 🚀 Key Features
- **Next.js App Router**: Full SSR/SSG support for SEO optimization.
- **Centralized Storage**: Staff saves directly to Admin's Drive/Sheets.
- **Admin Dashboard**: Manage users, categories, and master workspace.
- **Automated Testing**: Playwright suite for E2E reliability.

---

## Trạng thái hiện tại
 
**Last updated**: 2026-05-31
**Last session by**: Claude (claude-sonnet-4-6)
**Current version**: v1.11.9
**Current sprint focus**: Hoàn thành — Security hardening + SEO expansion.

---

## ⚠️ PROTOCOL QUAN TRỌNG (DÀNH CHO AGENT)
- **LUÔN LUÔN** trình bày kế hoạch (Implementation Plan) trước khi sửa code.
- **TUYỆT ĐỐI KHÔNG** tự ý thực hiện (Execute) khi chưa nhận được sự phê duyệt rõ ràng (ví dụ: "Approve", "Đồng ý", v.v.) từ User.
- **KIẾN TRÚC TÍN HIỆU ĐƠN (SINGLE-SIGNAL)**: Luôn ưu tiên dùng URL `share_id` làm tín hiệu duy nhất cho luồng Share Target, tránh dùng song song `BroadcastChannel` gây tranh chấp.
- **SESSION INIT (BOOT-01)**: Khi bắt đầu, luôn kiểm tra `docs/MEMORY.md` hoặc `ANTIGRAVITY.md` để nắm bối cảnh. Chủ động đánh giá độ lớn tài liệu để tránh quá tải ngữ cảnh (token overload).
- **SEARCH DOCS**: Phải dùng `grep_search` để tìm keyword trong các file `INDEX.md` trước khi quyết định đọc toàn văn một file tài liệu nào đó. Không đoán mò.
- **SPLIT PLAN & EXECUTE**: Đối với file mã nguồn lớn (>300 dòng), chủ động đề xuất kế hoạch tách file (Split Plan). Nếu User duyệt, mới thực hiện (Split Execute) với nguyên tắc bảo toàn nguyên vẹn business logic và cập nhật toàn bộ import/export liên quan.
- **SYNC MEMORY**: Cuối mỗi session hoặc khi hoàn thành một feature lớn, phải tổng hợp lại kiến thức, quyết định kỹ thuật, và bug fix để lưu vào `docs/memory/` hoặc `docs/changelog/` và cập nhật file `INDEX.md` tương ứng.
- **TOKEN AUDIT**: Cảnh giác với lượng token đang tiêu thụ. Hạn chế đọc toàn bộ file nếu không cần thiết, ưu tiên đọc theo line range, hoặc dọn dẹp context nếu session kéo dài.

---

## Context tóm tắt

### Đang làm gì?
Dự án đang ở trạng thái ổn định sau hai sprint lớn trong phiên 2026-05-31:
1. **SEO Expansion**: 8 trang nội dung mới đã được triển khai và commit.
2. **Security Hardening**: Các lỗ hổng bảo mật quan trọng đã được vá.

### Đã làm gì trong phiên trước? (2026-05-31)

**SEO — 8 trang mới:**
- `src/web/pages/use-cases/AliexpressResearch.tsx` — Dropshipping workflow
- `src/web/pages/use-cases/ShopifyCompetitorTracking.tsx` — Visual competitor tracking
- `src/web/pages/blog/SwipeFileChaos.tsx` — Swipe file organization
- `src/web/pages/blog/OrganizeProductImages.tsx` — Product image organization
- `src/web/pages/blog/GoogleDriveMetadata.tsx` — Metadata layer on Drive
- `src/web/pages/alternatives/ForeplayAlternative.tsx` — $9.99 vs $249/month
- `src/web/pages/alternatives/MagicBriefAlternative.tsx` — No custom quote
- `src/web/pages/alternatives/DamAlternative.tsx` — Affordable DAM for SMBs
- Đã cập nhật Next.js routes: `app/use-cases/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/alternatives/[slug]/page.tsx`
- Đã cập nhật Vite/Extension routes: `src/web/routes/PublicRoutes.tsx`

**Security Hardening:**
- `server.ts`: bcrypt (cost 12) cho staff passwords; CORS fix (credentials chỉ với extension origins, không bao giờ với `*`); Rate limiting (authLimiter: 10 req/15min trên staff-login, adminLimiter: 60 req/min trên /api/admin)
- `src/db.ts`: ADMIN_EMAILS từ env var `process.env.ADMIN_EMAILS` (fallback: hardcoded list)
- `src/db-postgres.ts`: Xóa hardcoded SQL auto-admin grant
- `package.json`: Bổ sung `bcrypt`, `express-rate-limit`; xóa `stripe`
- `src/shared/services/dataService.ts`: Thêm named constants cho column indices

### Dừng ở đâu?
- Branch `claude/imagesnap-feedback-HNaAY` đã được push với tất cả thay đổi.
- Codebase sạch, không có uncommitted changes.

---

## Open Items cần attention

```
[x] [DEV-2026W19-12] Implement Single-Signal Architecture for Share Target.
[x] [DEV-2026W19-12-FIX] Resolve SSR build errors (window/localStorage).
[ ] [DEV-2026W19-13] Verify PWA sharing reliability on multiple devices (Android/iOS).
[ ] [DEV-2026W19-14] Promote PWA installation to mobile users via UI banner.
[x] [DEV-2026W22-01] SEO: 8 new content pages (use-cases, blog, alternatives).
[x] [DEV-2026W22-02] Security: bcrypt passwords, CORS fix, rate limiting, admin env vars.
[ ] [DEV-2026W22-03] PRODUCTION ACTION: Set ADMIN_EMAILS env var on Vercel.
                     Value: chautnus@gmail.com,support@imagesnap.cloud
[ ] [DEV-2026W22-04] PRODUCTION ACTION: Reset existing staff passwords via admin UI
                     (existing plaintext passwords in DB must be reset to trigger bcrypt hashing).
[ ] [DEV-2026W22-05] SEO: Submit updated sitemap to Google Search Console after merge to main.
```

---

## Tech context quan trọng

### Dependency versions (critical)
```
node:               >=18.0.0
next:               ^16.2.4
react:              ^19.0.0
pg:                 ^8.20.0
bcrypt:             ^6.0.0
express-rate-limit: ^8.5.2
```

### Dual build pipeline (CRITICAL — always update both)
- **Next.js routes**: `app/[segment]/[slug]/page.tsx` — SSR web
- **Vite/Extension routes**: `src/web/routes/PublicRoutes.tsx` — Chrome extension side panel
- Khi thêm trang mới, PHẢI cập nhật CẢ HAI nơi.

### Column indices cho Google Sheets (dataService.ts)
```
COL_ID = 0, COL_CREATED_AT = 1, COL_IMAGES = 2, COL_NAME = 3,
COL_TAGS = 4, COL_AUTHOR_ID = 5, COL_AUTHOR_NAME = 6, COL_CUSTOM_FIELDS_START = 7
```

---

## Agent notes (phiên này để lại cho phiên sau)

- **QUY TẮC PHÊ DUYỆT**: Luôn đợi user gõ "Approve" mới được sửa file.
- Luồng Share Target hiện tại dựa hoàn toàn vào `share_id` từ URL. Không được thêm lại `BroadcastChannel` cho tín hiệu này.
- Khi thêm logic client-side mới, luôn chú ý kiểm tra `typeof window !== 'undefined'` để tránh lỗi build SSR.
- Staff login dùng bcrypt: `mapUser()` giữ `password` field cho internal comparison only — KHÔNG BAO GIỜ trả ra API response. Luồng login đã strip: `const { password: _pw, ...safeUser } = userEntry`.
- Existing staff accounts có plaintext password trong DB — admin phải reset qua `/api/admin/update-user` để trigger bcrypt hashing.
