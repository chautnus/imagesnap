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
  - Findings: Lỗi thiếu import trong `SettingsTab.tsx` gây crash (black screen). Tính năng snap cũ chọn tất cả ảnh không tối ưu.
  - Fixes: Bổ sung import; Implement `ImagePickerModal` với cơ chế phân loại ảnh (Logo, Banner, Main...) và cho phép chọn lọc. Thêm custom scrollbar.
  - Review: AGENT-REVIEW-A: APPROVE
  - Human: APPROVED by Antigravity on 2026-04-27

### 🔄 In Progress
- [DEV-2026W18-02] Rà soát và cập nhật GEMINI.md và ANTIGRAVITY.md để đồng bộ với doc ecosystem.
  - Status: Implementation

### 💡 Decisions Made
- [DEV-2026W18-D01] Chuyển đổi PROJECT_REQUIREMENTS.md và ARCHITECTURE.md cũ sang format chuẩn Antigravity.
  - Lý do: Tuân thủ quy trình quản lý dự án mới và đảm bảo tính liên kết (traceability) giữa yêu cầu và mã nguồn.

### 🐛 Bugs Found This Week
- N/A

### 📝 Notes / Observations
- Hệ thống tài liệu cũ khá chi tiết nhưng thiếu sự liên kết chặt chẽ. Việc chuẩn hóa sẽ giúp AI Agent hiểu bối cảnh dự án tốt hơn.

---
