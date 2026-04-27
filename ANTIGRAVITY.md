# ANTIGRAVITY.md — SESSION CONTEXT FILE
> File này là "bộ nhớ ngắn hạn" giữa các phiên làm việc.
> Agent PHẢI đọc file này đầu tiên (BOOT-01).
> Agent PHẢI cập nhật cuối mỗi phiên (/sync).

---

## Trạng thái hiện tại

**Last updated**: 2026-04-27 02:20
**Last session by**: Antigravity
**Current sprint focus**: Chuẩn hóa hệ thống tài liệu dự án ImageSnap theo tiêu chuẩn Antigravity v2.2.

---

## Context tóm tắt

### Đang làm gì?
Đang thực hiện rà soát và xây dựng hệ thống tài liệu (Documentation Ecosystem) bao gồm BR, BR_MAP, ARCH, RTM, và DEVLOG dựa trên các tài liệu rời rạc cũ.

### Đã làm gì trong phiên trước?
- Khởi tạo và populate `docs/BR.md` với các yêu cầu từ `PROJECT_REQUIREMENTS.md`.
- Tạo `docs/BR_MAP.md` làm index cho yêu cầu.
- Chuyển đổi `ARCHITECTURE.md` sang `docs/ARCH.md`, thiết lập liên kết với BR.
- Khởi tạo `docs/RTM.md` để theo dõi tính liên kết giữa yêu cầu, kiến trúc và file nguồn.
- Ghi log đầu tiên vào `docs/DEVLOG.md`.

### Dừng ở đâu?
- Đã hoàn thành cấu trúc cơ bản của thư mục `docs/`.
- Cần cập nhật `GEMINI.md` để reference đúng các file mới.
- Cần rà soát lại `BUGLOG.md` để xem có pattern nào cần lưu ý không.

---

## Open Items cần attention

```
[x] [DEV-2026W18-03] Audit toàn bộ hệ thống → COMPLETED.
[x] [DEV-2026W18-04] Sửa lỗi Login Extension (Chrome & Edge) → COMPLETED.
[x] [DEV-2026W18-05] Sửa lỗi Settings & Nâng cấp Image Picker → COMPLETED.
[x] [DEV-2026W18-06] Sửa lỗi tạo Category & Nâng cấp phân giải ảnh → COMPLETED.
[ ] [DEV-2026W18-02] Cập nhật GEMINI.md (root) → reference các file docs mới.
```

---

## Tech context quan trọng

### Dependency versions (critical)
```
node:     >=18.0.0
vite:     ^6.2.0
react:    ^19.0.0
express:  ^4.21.2
```

### Environment notes
- Dự án là một Browser Extension kết hợp React PWA.
- Server chạy Express, tích hợp Lemon Squeezy cho payment.

### Recent ARCH decisions (7 ngày)
- [DEV-2026W18-03] Audit toàn bộ hệ thống và fix sai lệch đường dẫn.
- [DEV-2026W18-04] Sửa lỗi Login trên Extension bằng `chrome.identity`.
- [DEV-2026W18-D01] Chuẩn hóa doc ecosystem sang Antigravity v2.2.

---

## Known gotchas / Cảnh báo

> Những điều agent phải nhớ để không lặp lỗi:
- ⚠ [ARCH-2.2]: Extension sử dụng `activeTab` permission, cần lưu ý khi thay đổi logic scraping.
- ⚠ [ARCH-2.1]: Server có Mock DB, cần cẩn thận khi restart server trong lúc dev.

---

## Agent notes (phiên này để lại cho phiên sau)

- Các file docs cũ như `ARCHITECTURE.md` và `PROJECT_REQUIREMENTS.md` vẫn còn đó, có thể xóa sau khi user xác nhận đã migrate đủ info.
- Chú ý encoding khi ghi file vào thư mục `docs/` nếu gặp lỗi charset detection.
