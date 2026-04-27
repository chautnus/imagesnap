# BUGLOG.md — BUG & FIX KNOWLEDGE BASE
> Mục tiêu: Ghi lại bài học từ lỗi để tái sử dụng, tránh lặp.
> Agent PHẢI đọc section OPEN trước khi implement feature mới.
> Agent PHẢI ghi vào đây sau mỗi lần fix bug (/log-fix).

---

## 📋 OPEN BUGS (Chưa fix)

<!-- [BUG-XXX] sẽ được thêm vào đây khi phát hiện -->

---

## ✅ CLOSED BUGS (Đã fix — kiến thức có thể tái dùng)

### [BUG-002] — Lỗi Login trên Microsoft Edge Extension
**Status**: CLOSED
**Severity**: HIGH
**Discovered**: [DEV-2026W18] | **Fixed**: [DEV-2026W18]
**Linked BR**: → [BR-3.1]
**Linked ARCH**: → [ARCH-2.2]

#### Symptom
Trên trình duyệt Edge, gọi `chrome.identity.getAuthToken` trả về lỗi "This API is not supported". Sau khi đăng nhập Google thành công, app bị quay lại màn hình Landing thay vì vào App.

#### Root Cause
1. Edge không hỗ trợ `getAuthToken` cho tài khoản Google, yêu cầu luồng OAuth chuẩn qua WebAuthFlow.
2. App không tự động nhận diện token từ `localStorage` ngay sau khi reload trong môi trường extension.

#### Fix Applied
```typescript
// Sử dụng launchWebAuthFlow thay vì getAuthToken
window.chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl) => {
  // Trích xuất token và lưu vào localStorage
});

// Cập nhật initGis để kiểm tra cả localStorage làm fallback
```

#### Lesson Learned
⚠ BÀI HỌC #002: Luôn sử dụng `launchWebAuthFlow` cho extension đa trình duyệt (Cross-browser) khi làm việc với OAuth bên thứ 3.

#### Prevention
- [x] Sử dụng pattern `PAT-002` cho mọi logic Auth trong extension sau này.

### [BUG-001] — [Tên lỗi ngắn gọn]
**Status**: CLOSED
**Severity**: CRITICAL / HIGH / MEDIUM / LOW
**Discovered**: [DEV-YYYYWnn] | **Fixed**: [DEV-YYYYWnn]
**Linked BR**: → [BR-X.Y.Z]
**Linked ARCH**: → [ARCH-X.Y]

#### Symptom
[Mô tả triệu chứng — người dùng thấy gì, log thấy gì]

#### Root Cause
[Giải thích tại sao xảy ra, kỹ thuật cụ thể]

#### Fix Applied
```language
// TRƯỚC (sai):
[code sai]

// SAU (đúng):
[code đúng]
```

#### Lesson Learned
⚠ BÀI HỌC #001: [Phát biểu ngắn gọn bài học có thể áp dụng tổng quát]

#### Prevention
- [ ] [Action đã thực hiện để tránh tái phát: thêm lint rule, test, v.v.]

---

## 📚 PATTERNS LIBRARY
> Tổng hợp bài học tái sử dụng từ các bug đã fix.
> Agent phải đọc section này khi implement tính năng liên quan.

### PAT-002: Cross-Browser Extension OAuth
→ Xem [BUG-002]. Áp dụng khi: Cần đăng nhập Google trên cả Chrome và Edge extension.
Tóm tắt: Sử dụng `launchWebAuthFlow` kết hợp với `getRedirectURL()` và cơ chế fallback `localStorage` để duy trì session sau reload.

---

## STATS
| Metric | Value |
|--------|-------|
| Total bugs logged | 0 |
| Open | 0 |
| Closed | 0 |
| Patterns extracted | 0 |
