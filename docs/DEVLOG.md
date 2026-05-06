# DEVLOG.md — DEVELOPMENT LOG
> Ghi lại mọi thay đổi theo tuần. Agent cập nhật sau mỗi milestone.
> Format ID: DEV-[YEAR]W[WEEK]-[SEQ]

---

## [DEV-2026W18] Tuần 18/2026 (27 Apr – 03 May)

### ✅ Completed
- [DEV-2026W18-01] Khởi tạo hệ thống tài liệu theo tiêu chuẩn Antigravity v2.2 → [BR-1 -> BR-4] → [ARCH-1 -> ARCH-5]
  - Files changed: `docs/BR.md`, `docs/BR_MAP.md`, `docs/ARCH.md`, `docs/RTM.md`, `docs/DEVLOG.md`
  - Tests added: N/A
  - Review: AGENT-REVIEW-A: APPROVE
  - Human: APPROVED by Antigravity on 2026-04-27
- [DEV-2026W18-03] Audit toàn bộ hệ thống tài liệu và mã nguồn → [BR-1 -> BR-4]
  - Findings: Phát hiện sai lệch đường dẫn (src/lib vs src/shared/lib) và thiếu coverage cho Bulk Import.
  - Fixes: Cập nhật `ARCH.md` và `RTM.md` với đường dẫn thực tế và bổ sung mapping.
  - Review: AGENT-REVIEW-A: APPROVE
  - Human: APPROVED by Antigravity on 2026-04-27
- [DEV-2026W18-04] Sửa lỗi Login trên Extension do rào cản CSP và hỗ trợ Edge → [BR-3.1]
  - Findings: CSP chặn load GSI script; Edge không hỗ trợ `getAuthToken`.
  - Fixes: Chuyển sang `launchWebAuthFlow` và bổ sung fallback `localStorage` trong `initGis`.
  - Review: AGENT-REVIEW-A: APPROVE
  - Human: APPROVED by Antigravity on 2026-04-27
- [DEV-2026W18-05] Sửa lỗi crash tab Settings và nâng cấp Image Picker → [BR-3.3]
  - Fixes: Bổ sung import; Implement `ImagePickerModal` với cơ chế phân loại ảnh. Thêm custom scrollbar.
- [DEV-2026W18-06] Triển khai Centralized Storage & Staff Login → [BR-1.3, BR-2.3]
  - Fixes: Xây dựng Server Proxy để nhân viên lưu data về Drive của Admin. Thêm giao diện Staff Login.
- [DEV-2026W18-07] Fix lỗi CORS & Edge API support → [BR-3.1]
  - Fixes: Cấu hình CORS middleware cho domain `www.imagesnap.cloud`. Loại bỏ `getAuthToken` gây lỗi trên Edge.
- [DEV-2026W18-08] Thiết lập Automated Testing Framework → [BR-5.1]
  - Fixes: Cài đặt Playwright, viết test script cho luồng Staff Login.
- [DEV-2026W18-09] Chrome Store Compliance & Camera Enhancements → [BR-5.1, BR-3.2]
  - Fixes: Gỡ bỏ code từ xa (GAPI) và quyền storage. Sửa lỗi camera đen.
  - Features: Triển khai Burst Mode, Native Camera Support, h-[100dvh] cho mobile.
  - Version: Bump to 1.2.4.
- [DEV-2026W18-10] Final UI Polish & Instructional Workflow → [BR-3.2]
  - Fixes: Triển khai `fixed inset-0` và `min-h-0` cho Burst Cam để sửa triệt để lỗi tràn màn hình trên di động.
  - Docs: Cập nhật hướng dẫn quy trình chụp ảnh qua Gallery để tối ưu việc dùng Zoom/Focus của máy.
  - Version: Bump to 1.2.5.
- [DEV-2026W18-11] Burst Cam Hardware Control (Zoom & Torch) → [BR-3.2]
  - Features: Implement hardware capability detection for `zoom` and `torch`.
  - UI: Added vertical zoom slider and flash toggle button to the in-app camera.
  - Version: Bump to 1.2.6.
- [DEV-2026W18-12] Advanced Camera Controls & Header Versioning → [BR-3.2, BR-4.1]
  - Features: Implement `exposureCompensation` and experimental `pointsOfInterest` focus.
  - UI: Added exposure slider and moved version display to the Header for 100% visibility.
  - Version: Bump to 1.2.7.
- [DEV-2026W18-13] Professional Camera Experience (Burst Cam v2) → [BR-3.2]
  - Features: Implement Pinch-to-Zoom, Grid Overlay, Ratio Lock (Square mode), and Focus visualizer.
  - UI: Added Session Thumbnail Strip to the camera modal for instant review.
  - Fixes: Resolved syntax errors in JSX; optimized touch handling for mobile.
  - Version: Bump to 1.2.8.
- [DEV-2026W18-14] Multi-source Thumbnail Support → [BR-1.2.1]
  - Fixes: Enhanced `DriveImage` component to support regular HTTP/HTTPS URLs from scrapers.
  - Features: Improved error handling and lazy loading for external assets.
  - Version: Bump to 1.2.9.
- [DEV-2026W18-15] Universal Drive ID Support for Thumbnails → [BR-1.2.1]
  - Fixes: Expanded regex and ID detection in `DriveImage` to support `webViewLink` and raw IDs.
  - UI: Verified version display as V1.3.0.
  - Version: Bump to 1.3.0.
  - Human: APPROVED by user on 2026-04-28

  - Human: APPROVED by user on 2026-04-28

  - Human: APPROVED by user on 2026-04-28

  - Human: APPROVED by user on 2026-04-28

  - Human: APPROVED by user on 2026-04-28

  - Human: APPROVED by user on 2026-04-28

  - Review: AGENT-REVIEW-A: APPROVE
  - Human: APPROVED by user on 2026-04-28


## [DEV-2026W19] Tuần 19/2026 (04 May – 10 May)

### ✅ Completed
- [DEV-2026W19-01] PostgreSQL Migration for Permanent Persistence → [BUG-013]
  - Fixes: Replaced `user_db.json` with a managed PostgreSQL database. Created `src/db-postgres.ts` and refactored `src/db.ts`.
  - Results: User usage and subscription data now survive Railway deployments and restarts.
- [DEV-2026W19-02] Fixed Select Field Options Comma Bug → [BUG-012]
  - Fixes: Decoupled raw input string from parsed array state in `CategoryEditor.tsx`.
- [DEV-2026W19-03] Unified Versioning and Extension ID Optimization → [BUG-014]
  - Fixes: Synchronized all version strings to `v1.3.4`.
  - Features: Added permanent `"key"` to `manifest.json` to lock the Extension ID.
  - Results: Resolved `redirect_uri_mismatch` by providing a stable ID for Google Cloud Console.

### 🔄 In Progress
- [DEV-2026W19-04] Auto-Silent Login implementation for improved UX.
- [DEV-2026W19-05] Rà soát lại toàn bộ tài liệu dự án để đồng bộ với cấu trúc PostgreSQL mới.

### 💡 Decisions Made
- [DEV-2026W19-D01] Abandoned local JSON storage in favor of PostgreSQL.
  - Lý do: Đảm bảo tính toàn vẹn dữ liệu cho người dùng trả phí và tránh lỗi reset quota trên Railway.

- [DEV-2026W18-02] Rà soát và cập nhật GEMINI.md và ANTIGRAVITY.md để đồng bộ với doc ecosystem.
  - Status: Implementation
- [DEV-2026W18-16] Đồng bộ BUGLOG.md với các lỗi đã fix từ tuần 18.
  - Fixes: Bổ sung BUG-004 đến BUG-008. Cập nhật bảng thống kê lỗi.
- [DEV-2026W18-17] Nhất quán Metadata PWA/Extension & Fix PWA icon.
- [DEV-2026W18-18] Cải tổ UI CaptureTab: Xóa Bulk Import, cấu trúc lại Header và Labels.
- [DEV-2026W18-19] Triển khai 3 biến thể Landing Page (/1, /2, /3) phục vụ Marketing.
- [DEV-2026W18-20] Khắc phục lỗi hiển thị đồng nhất Landing Page Variants.
- [DEV-2026W18-21] Fix syntax error trong LandingPage.tsx (duplicated export) ngăn cản việc build/reload.

### 💡 Decisions Made
- [DEV-2026W18-D01] Chuyển đổi PROJECT_REQUIREMENTS.md và ARCHITECTURE.md cũ sang format chuẩn Antigravity.
  - Lý do: Tuân thủ quy trình quản lý dự án mới và đảm bảo tính liên kết (traceability) giữa yêu cầu và mã nguồn.

### 🐛 Bugs Found This Week
- N/A

### 📝 Notes / Observations
- Hệ thống tài liệu cũ khá chi tiết nhưng thiếu sự liên kết chặt chẽ. Việc chuẩn hóa sẽ giúp AI Agent hiểu bối cảnh dự án tốt hơn.

---
