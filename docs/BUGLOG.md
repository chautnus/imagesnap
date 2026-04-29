# BUGLOG.md — BUG & FIX KNOWLEDGE BASE
> Mục tiêu: Ghi lại bài học từ lỗi để tái sử dụng, tránh lặp.
> Agent PHẢI đọc section OPEN trước khi implement feature mới.
> Agent PHẢI ghi vào đây sau mỗi lần fix bug (/log-fix).

---

## 📋 OPEN BUGS (Chưa fix)

<!-- [BUG-XXX] sẽ được thêm vào đây khi phát hiện -->

---

## ✅ CLOSED BUGS (Đã fix — kiến thức có thể tái dùng)

---

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

### PAT-001: [Tên pattern]
→ Xem [BUG-001]. Áp dụng khi: [...]
Tóm tắt: [1-2 câu]

---

### PAT-IMPORT-001: Missing Import khi thêm symbol vào file hiện có
**Áp dụng khi**: thêm component, hook, icon, type, util vào file đã tồn tại
**Root cause**: AI chỉ thấy đoạn code cần thêm, không thấy toàn bộ import block
**Rules liên quan**: RULE-16, RULE-17, RULE-18

**Prevention**:
- Paste toàn bộ import block hiện tại vào prompt khi yêu cầu AI sửa file
- Yêu cầu AI xuất lại import block đầy đủ, không chỉ đoạn code mới
- Chạy `tsc --noEmit` (TS/TSX) hoặc ESLint `no-undef` (JS/JSX) trước /review
- Kiểm tra import_audit: `missing_imports_found = []`

**Prompt pattern đúng**:
```
Thêm [symbol] vào [file].
Import block hiện tại của file:
[paste toàn bộ import block]
Yêu cầu: xuất lại toàn bộ import block sau khi sửa, không chỉ đoạn code mới.
```

**Tooling note**:
- TS/TSX: `npx tsc --noEmit` — nguồn xác minh chính. KHÔNG dùng `no-undef` cho TypeScript.
- JS/JSX: ESLint `no-undef` + `react/jsx-no-undef` — hợp lệ và khuyến nghị.

---

## STATS
| Metric | Value |
|--------|-------|
| Total bugs logged | 2 |
| Open | 0 |
| Closed | 2 |
| Patterns extracted | 2 |
