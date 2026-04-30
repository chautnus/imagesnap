# BUGLOG.md — BUG & FIX KNOWLEDGE BASE
> Mục tiêu: Ghi lại bài học từ lỗi để tái sử dụng, tránh lặp.
> Agent PHẢI đọc section OPEN trước khi implement feature mới.
> Agent PHẢI ghi vào đây sau mỗi lần fix bug (/log-fix).

---

## 📋 OPEN BUGS (Chưa fix)

<!-- [BUG-XXX] sẽ được thêm vào đây khi phát hiện -->

---

---

### [BUG-009] — Help/Guide Navigation Loop
**Status**: CLOSED
**Severity**: LOW
**Discovered**: [2026-04-30] | **Fixed**: [2026-04-30]
**Linked BR**: → [BR-3.2]

#### Symptom
The "Help" link in the Capture tab opened a new browser tab, taking the user away from the app context. If the user was in an extension popup, this could lead to the popup closing or a disjointed experience.

#### Root Cause
External navigation for primary documentation instead of an integrated in-app view.

#### Fix Applied
Created a dedicated `HelpTab` component and updated the bottom `Navigation` to include a Help tab. Redirected all in-app "Help" links to switch to this tab.

#### Lesson Learned
⚠ BÀI HỌC #009: For PWAs and Browser Extensions, keep documentation and guides "in-app" as much as possible to maintain user session and prevent context switching.

---

### [BUG-008] — Thumbnail Visibility Issues
**Status**: CLOSED
**Severity**: MEDIUM
**Discovered**: [2026-04-28] | **Fixed**: [2026-04-28]
**Linked BR**: → [BR-1.2.1]

#### Symptom
Some product thumbnails in the Data tab were showing placeholders instead of the actual image from Google Drive, especially for links captured via the Extension.

#### Root Cause
The `DriveImage` component used a limited regex that only recognized specific Drive URL formats. It failed on `webViewLink` and raw IDs without the `id=` prefix.

#### Fix Applied
Expanded the regex and ID detection logic to support multiple formats (d/ID, id=ID, and raw strings).
```tsx
const extractId = (url: string) => {
  const match = url.match(/[-\w]{25,}/); // Generic Drive ID pattern
  return match ? match[0] : null;
};
```

#### Lesson Learned
⚠ BÀI HỌC #008: External APIs (like Google Drive) have multiple URL flavors. Always use robust regex or universal ID extraction logic for media assets.

---

### [BUG-007] — Mobile UI Layout Overflow
**Status**: CLOSED
**Severity**: HIGH
**Discovered**: [2026-04-27] | **Fixed**: [2026-04-27]
**Linked BR**: → [BR-3.2]

#### Symptom
The camera interface and some modals were "overflowing" the mobile screen, making buttons at the bottom inaccessible.

#### Root Cause
Traditional `100vh` in CSS doesn't account for mobile browser toolbars (address bar). `h-screen` often causes overflow.

#### Fix Applied
Used `fixed inset-0` combined with `min-h-0` and `flex-col` to force the layout to stay within the actual visible area (Visual Viewport).

#### Lesson Learned
⚠ BÀI HỌC #007: For full-screen mobile apps, avoid `h-screen`. Use `fixed inset-0` or `h-[100dvh]` to ensure UI elements are always reachable.

---

### [BUG-006] — Camera Black Screen
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-04-27] | **Fixed**: [2026-04-27]
**Linked BR**: → [BR-3.2.1]

#### Symptom
Users reported the camera preview appearing as a black rectangle on certain Chrome/Edge versions.

#### Root Cause
Conflict with legacy GAPI (Google API) scripts that were being loaded remotely, interfering with modern `navigator.mediaDevices` access.

#### Fix Applied
Completely removed all remotely hosted scripts (compliance with Chrome Store) and switched to a pure local implementation using native WebRTC APIs.

#### Lesson Learned
⚠ BÀI HỌC #006: Remotely hosted scripts are not only a security risk/compliance issue but can also introduce unpredictable side effects in hardware access.

---

### [BUG-005] — Settings Tab Crash
**Status**: CLOSED
**Severity**: HIGH
**Discovered**: [2026-04-27] | **Fixed**: [2026-04-27]

#### Symptom
Clicking the Settings tab caused the entire application to white-screen (crash).

#### Root Cause
Reference to a component that was not imported in the `SettingsTab.tsx` file after a refactoring session.

#### Fix Applied
Added the missing `import` statement.

#### Lesson Learned
⚠ BÀI HỌC #005: Use `tsc --noEmit` as part of the pre-commit or pre-review check to catch missing imports that ESLint might miss in certain configurations.

---

### [BUG-004] — Extension Login Failure (CSP/Edge)
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-04-27] | **Fixed**: [2026-04-27]
**Linked BR**: → [BR-3.1]

#### Symptom
The Extension failed to login on Chrome due to Content Security Policy (CSP) errors and completely failed on Microsoft Edge.

#### Root Cause
- Chrome: GSI (Google Identity Services) script cannot be loaded from remote URLs in Manifest V3.
- Edge: `chrome.identity.getAuthToken` is not supported on non-Google browsers.

#### Fix Applied
Switched to `chrome.identity.launchWebAuthFlow` which works on both Chrome and Edge, and bundled all auth logic locally.

#### Lesson Learned
⚠ BÀI HỌC #004: When building cross-browser extensions, avoid browser-specific identity APIs. Use universal OAuth flows like `launchWebAuthFlow`.

---

### [BUG-003] — New Category Modal Black Screen on Mobile
**Status**: CLOSED
**Severity**: HIGH
**Discovered**: [2026-04-30] | **Fixed**: [2026-04-30]

#### Symptom
When clicking the "New Category" button on the Capture screen, the screen goes completely black. 

#### Root Cause
A React runtime error occurred because a state variable (`newCatIcon`) was referenced in a two-way binding (`value={newCatIcon}`) but was not declared in the component's state (`useState`). This caused the component rendering the `AnimatePresence` modal to crash, displaying a black background container.

#### Fix Applied
Added the missing state variable declaration to `CaptureTab.tsx`.
```tsx
// SAU (đúng):
const [newCatName, setNewCatName] = useState('');
const [newCatIcon, setNewCatIcon] = useState('📦');
```

#### Lesson Learned
⚠ BÀI HỌC #003: Always ensure that all variables bound to input fields are properly initialized in the component state, especially when migrating or adding new UI elements to a complex modal. Uncaught render errors in React will crash the UI.

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
| Total bugs logged | 8 |
| Open | 0 |
| Closed | 8 |
| Patterns extracted | 2 |
