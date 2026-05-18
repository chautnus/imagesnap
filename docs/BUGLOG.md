# BUGLOG.md — BUG & FIX KNOWLEDGE BASE
> Mục tiêu: Ghi lại bài học từ lỗi để tái sử dụng, tránh lặp.
> Agent PHẢI đọc section OPEN trước khi implement feature mới.
> Agent PHẢI ghi vào đây sau mỗi lần fix bug (/log-fix).

---

### [BUG-028] — Eternal Infinite Authentication Redirect Loop (Lỗi muôn thuở)
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-05-18] | **Fixed**: [2026-05-18]

#### Symptom
When the Google access token inside the session cookie expired after 1 hour, the user got locked into an infinite authentication redirect loop between the Home Page (`/`) and the Dashboard (`/dashboard`), rendering the login screen inaccessible.

#### Root Cause
A critical disparity in token lifetimes:
1. Google's client-side Implicit Flow only yields a 1-hour access token.
2. The server-side session cookie (`imagesnap_session`) is set to last for 24 hours.
3. When the Google access token inside the cookie expired, `/dashboard` aborted initialization, threw an auth error, and pushed the client to `/`.
4. However, `HomeClient.tsx` checked the session API, saw it was still authenticated, and instantly redirected the user back to `/dashboard`, creating a infinite redirect cycle.

#### Fix Applied
1. **Active Token Verification on Home Ingress:** Integrated a live validation hook inside `HomeClient.tsx` that queries Google's `/oauth2/v3/userinfo` with the session's token before triggering a redirect.
2. **Self-Healing Session Purge:** If the token is invalid/expired, `HomeClient` immediately triggers a `DELETE` request to `/api/auth/session` to clear the cookie and stays on the landing page.
3. **Automated SW Cookie Invalidation:** Added session cleanup in `useDashboardInit.ts` on `SYS_AUTH_EXPIRED` to purge the cookie directly at the source of expiration.

#### Lesson Learned
⚠ BÀI HỌC #028: When bridging short-lived third-party OAuth access tokens inside long-lived secure session cookies, always perform a client-side verification query against the identity provider's validator before triggering automatic redirects, and guarantee a self-healing purge on failure.

---

### [BUG-027] — PWA Web Share Target Freeze at Launch Splash Screen (Logo/Icon PWA)
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-05-18] | **Fixed**: [2026-05-18]

#### Symptom
When users shared an image or link from an external mobile application (e.g. Gallery) to the PWA on Android (Chrome/Samsung Internet), the application got completely frozen at the PWA launching splash screen (app logo/icon) and never loaded the Dashboard.

#### Root Cause
Under modern mobile Web Share Target specifications, if the Service Worker's `'fetch'` handler intercepts a POST request and returns a standard `Response.redirect()`, Chrome on Android can fail to resolve the navigation promise or release the PWA's standalone window splash screen, leaving the UI hanging.

#### Fix Applied
Replaced the `Response.redirect()` within `sw.js` with a successful **Status 200 HTML response** that embeds a client-side redirection script:
```javascript
return new Response(
  `<script>window.location.replace("${redirectUrl}");</script>`,
  { headers: { 'Content-Type': 'text/html' } }
);
```
Since the browser receives an immediate valid 200 OK HTML payload, the system instantly dismisses the splash screen and loads the script, which performs a perfect client-side replace to `/dashboard?share_id=...` with 100% reliability.

#### Lesson Learned
⚠ BÀI HỌC #027: To prevent OS-level PWA launch freezes on mobile devices during Web Share Target intercept operations, avoid returning server-side redirects (`Response.redirect`) from the Service Worker fetch listener. Instead, serve a lightweight HTML response containing a client-side `window.location.replace` directive.

---

### [BUG-026] — Mobile PWA Share Target Failure & DB Ingestion Crash
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-05-18] | **Fixed**: [2026-05-18]

#### Symptom
Mobile PWA users could not share images, text, or links to the application from other apps (e.g. Gallery, Chrome). The application either threw a `TypeError` in the Service Worker or crashed inside the Next.js Dashboard with a `NotFoundError` (One of the specified object stores was not found).

#### Root Cause
Multiple critical architectural bugs:
1. **Missing `onupgradeneeded` in client-side IndexedDB opening calls:** Both `useDashboardInit.ts` and `CaptureTab.tsx` opened the database `imagesnap-pwa-db` at version 2 without an `onupgradeneeded` listener. If opened on a clean browser, the database was created without the `shares` object store.
2. **Missing `onupgradeneeded` in SW Activation:** The Service Worker `'activate'` handler called `pruneOldShares()` which opened the database version 2 without `onupgradeneeded`, silently creating a storeless database in the background before any share was processed.
3. **Relative URL in `Response.redirect()` within Service Worker:** In `sw.js`, redirects were responded using `Response.redirect('/dashboard?share_id=...')` which throws a `TypeError` in modern mobile browsers since the Fetch API requires absolute URLs in SW context.
4. **Chrome/Android URL text mismatch:** Mobile Chrome shares product links under the `text` field instead of `url`. Because the client dashboard did not extract links from `text`, the shared URL was ignored.
5. **Divergent file field names:** Some sharing clients sent images under custom fields instead of the defined `"images"` field name in manifest.json.

#### Fix Applied
1. **Self-Healing DB across all endpoints:** Added `onupgradeneeded` to guarantee creation of the `shares` store in `useDashboardInit.ts`, `CaptureTab.tsx` (Next.js), `DiagnosticsWizard.tsx` (all opens), `sw.js` (`pruneOldShares`), and `sw-logger.js` (`writeErrorToIDB`).
2. **Absolute Redirects:** Updated `sw.js` to redirect using absolute URLs constructed with `self.location.origin`.
3. **Regex URL Extraction:** Implemented a robust fallback pattern using `/https?:\/\/[^\s]+/i` to extract links from `text` if `url` is empty.
4. **Fallback Image Harvester:** Added an entries iterator (`formData.entries()`) to capture any shared file of type `image/*` as a fallback.

#### Lesson Learned
⚠ BÀI HỌC #026: In complex multi-entry architectures (Next.js client-side code, Service Worker context, error loggers) that interact with a single IndexedDB database, **every single database open call must include an `onupgradeneeded` handler** to guarantee schema safety. Never use relative URLs in Service Worker `Response.redirect()`, and always build fallback parsing for mobile sharing parameter mismatches.

---

**Discovered**: [2026-05-06] | **Fixed**: [2026-05-06]

---

### [BUG-021] — DataTab Search Focus Loss
**Status**: CLOSED
**Severity**: MEDIUM
**Discovered**: [2026-05-08] | **Fixed**: [2026-05-08]

#### Symptom
Users could only type one character in the search bar of the Data Tab before the input lost focus, requiring a re-click for every character.

#### Root Cause
The search header was being rendered via a helper function (`renderSearchHeader`) called during each render. Because the function was redefined on every render and called as a sub-render, React's reconciliation process treated the input as a new element, destroying its focus.

#### Fix Applied
Inlined the search header JSX directly into the `DataTab` render method. This preserves the component identity across re-renders triggered by state changes.

#### Lesson Learned
⚠ BÀI HỌC #021: Avoid using helper functions to render inputs that hold their own focus state within a component. Always inline or use stable sub-components with proper keys to maintain element identity.

---

### [BUG-020] — Infinite Authentication Redirect Loop on Mobile
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-05-08] | **Fixed**: [2026-05-08]

#### Symptom
Mobile users encountered an infinite loop where the app would redirect from the Home page to the Dashboard and back to Home continuously.

#### Root Cause
A race condition and state mismatch:
1. `HomeClient` saw a token in `localStorage` and redirected to `/dashboard`.
2. `dashboard/page.tsx` failed to verify the token (e.g., due to expiration or mobile browser restrictions) and redirected back to `/`.
3. The invalid token was never cleared, triggering the cycle again.

#### Fix Applied
1. Added explicit `localStorage.removeItem('ps_access_token')` on any auth failure in both Dashboard and Home components.
2. Improved verification logic to ensure the profile is valid BEFORE attempting a redirect.

#### Lesson Learned
⚠ BÀI HỌC #020: Always clear the authentication state/token before redirecting to a "Login Required" page to prevent infinite loops. State "cleanup" must precede "navigation".

---

### [BUG-019] — Character Encoding Artifacts (Garbled Text)
**Status**: CLOSED
**Severity**: MEDIUM
**Discovered**: [2026-05-07] | **Fixed**: [2026-05-08]

#### Symptom
UI elements displayed garbled characters like `â€”`, `â–¼`, and `â€¢` instead of arrows, dashes, or bullet points.

#### Root Cause
Files were saved or interpreted with incorrect encoding (likely UTF-8 vs ISO-8859-1) during previous automated edits or environment shifts, causing non-standard ASCII characters to break.

#### Fix Applied
Replaced all hardcoded symbols with standard punctuation or SVG icons from the `lucide-react` library across all components (`LandingPage`, `PublicHeader`, `CaptureTab`, `DataTab`).

#### Lesson Learned
⚠ BÀI HỌC #019: Never rely on special characters or emojis in source code strings if they aren't strictly UTF-8 compliant. Prefer standard SVG icons for UI indicators like arrows and toggles.

---

### [BUG-018] — OG Image Pointing to Localhost
**Status**: CLOSED
**Severity**: HIGH
**Discovered**: [2026-05-07] | **Fixed**: [2026-05-07]

#### Symptom
Social media previews (Facebook/Twitter) were broken because the OpenGraph image metadata was hardcoded to `http://localhost:3000/og-image.png`.

#### Root Cause
Metadata configuration was left with development values during the initial SEO setup.

#### Fix Applied
Updated `layout.tsx` metadata to use the production URL `https://www.imagesnap.cloud/og-image.png`.

#### Lesson Learned
⚠ BÀI HỌC #018: Always verify metadata URLs in a production-like environment before final deployment. Hardcoded local URLs in meta tags are a common cause of broken SEO previews.

---

### [BUG-017] — Duplicate UI Titles in Dashboard Tabs
**Status**: CLOSED
**Severity**: LOW
**Discovered**: [2026-05-08] | **Fixed**: [2026-05-08]

#### Symptom
The Dashboard displayed the tab name twice (e.g., "CAPTURE" in the header and another "CAPTURE" in the tab body).

#### Root Cause
Redundant `h2` elements were present in individual tab components while the main `Header` was also rendering the `activeTab` title.

#### Fix Applied
Removed local title elements from `CaptureTab`, `DataTab`, `SettingsTab`, and `HelpTab`.

#### Lesson Learned
⚠ BÀI HỌC #017: Maintain a clear separation of concerns between layout (Header) and content (Tabs). Layout elements should handle global context like titles.

---

### [BUG-023] — Stale Pricing References in Landing Page
**Status**: CLOSED
**Severity**: MEDIUM
**Discovered**: [2026-05-08] | **Fixed**: [2026-05-08]

#### Symptom
The Landing Page and Schema markup displayed outdated pricing ($19/mo or $29 lifetime) while the actual price was set to $9.99/mo.

#### Root Cause
Hardcoded pricing strings were scattered across `LandingPage.tsx`, `PricingPage.tsx`, and `index.html`. During pricing updates, some files were missed.

#### Fix Applied
Updated all references to $9.99/mo and $99.9/yr across all components and schema metadata.

#### Lesson Learned
⚠ BÀI HỌC #023: Pricing should ideally be pulled from a central config file or the database to avoid "stale pricing" bugs in marketing copy.

---

### [BUG-022] — Cross-platform Version Desync
**Status**: CLOSED
**Severity**: LOW
**Discovered**: [2026-05-08] | **Fixed**: [2026-05-08]

#### Symptom
The Chrome Extension, Web Dashboard, and Landing Page reported different version numbers (v1.4.1 vs v1.4.2).

#### Root Cause
Manual updates of version strings in `manifest.json`, `package.json`, and multiple React components were inconsistent.

#### Fix Applied
Standardized all version strings to `v1.4.2` and documented the need for a unified versioning script.

#### Lesson Learned
⚠ BÀI HỌC #022: Use a pre-build script to inject the version from `package.json` into all relevant files (manifest, UI, help docs) to ensure 100% parity.
**Status**: CLOSED
**Severity**: HIGH
**Discovered**: [2026-05-06] | **Fixed**: [2026-05-06]

#### Symptom
Users saw "Cannot access contents of the page. Extension manifest must request permission" when trying to Snap after navigating to a new page.

#### Root Cause
Broad host permissions (`*://*/*`) were removed in favor of `activeTab`. However, `activeTab` only persists as long as the user stays on the page where they clicked the extension. Navigating away kills the permission, and the Side Panel (which stays open) loses access.

#### Fix Applied
Restored `*://*/*` to `host_permissions` in `manifest.json`.

#### Lesson Learned
⚠ BÀI HỌC #016: For extensions with a persistent Side Panel that interacts with tabs (scraping, snapping), broad host permissions are often necessary because `activeTab` is too transient for a "universal tool" experience.

---

### [BUG-015] — Google OAuth redirect_uri_mismatch and 'bad client id'
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-05-06] | **Fixed**: [2026-05-06]

#### Symptom
Users encountered "Error 400: redirect_uri_mismatch" during login. Console also showed "bad client id" warnings.

#### Root Cause
1. Mismatch between Client ID in `manifest.json` and the code.
2. Using `chrome.identity.getAuthToken` (which expects an Extension Client ID) with a Web App Client ID.
3. Inconsistent `redirect_uri` construction between local and production.

#### Fix Applied
- Synchronized Client ID `...3arbjl.apps...` across all files.
- Disabled `getAuthToken` silent check and fallbacks since we use Web App Client IDs.
- Hardcoded the fixed `redirect_uri` for the production Extension ID.

#### Lesson Learned
⚠ BÀI HỌC #015: When using a Web Application Client ID in a Chrome Extension (to support Edge/Web cross-platform auth), NEVER use `getAuthToken`. Only use `launchWebAuthFlow` with a fixed, explicitly defined `redirect_uri`.

---

### [BUG-014] — Version Inconsistency Across UI Components
**Status**: CLOSED
**Severity**: LOW
**Discovered**: [2026-05-04] | **Fixed**: [2026-05-04]

#### Symptom
The version displayed in the Header was v1.3.1 while the project was already at v1.3.2. Other components like HelpTab were also outdated.

#### Root Cause
Hardcoded version strings in multiple React components (`App.tsx`, `Header.tsx`, `HelpTab.tsx`) instead of pulling from a single source of truth.

#### Fix Applied
Updated all hardcoded strings to `v1.3.4` and synchronized with `package.json` and `manifest.json`.
*Future Fix: Import version from package.json in the build process.*

#### Lesson Learned
⚠ BÀI HỌC #014: Always search for project version strings across the entire codebase before releasing a new version.

---

### [BUG-013] — User Data Loss on Railway Deployment
**Status**: CLOSED
**Severity**: CRITICAL
**Discovered**: [2026-05-04] | **Fixed**: [2026-05-06]

#### Symptom
Every time the code was pushed to Railway or the server restarted, all user usage counts and subscription data were reset to 0.

#### Root Cause
The system was using a local `user_db.json` file for storage. Railway's ephemeral file system wipes all local changes on every deployment/restart.

#### Fix Applied
Migrated the entire user and configuration storage layer to **PostgreSQL**.
- Created `src/db-postgres.ts` for connection pooling and schema initialization.
- Refactored `src/db.ts` to use async SQL queries instead of synchronous JSON reading.

#### Lesson Learned
⚠ BÀI HỌC #013: NEVER use local file storage for persistent data on ephemeral cloud platforms like Railway/Heroku. Always use a managed database service.

---

### [BUG-012] — Select Options Comma Input Bug
**Status**: CLOSED
**Severity**: MEDIUM
**Discovered**: [2026-05-04] | **Fixed**: [2026-05-05]

#### Symptom
Users could not type a comma (`,`) when setting options for a 'select' field type in the Category Editor. The character was either blocked or caused the input to reset.

#### Root Cause
The `onChange` and `value` logic in `CategoryEditor.tsx` was conflicting. React was attempting to parse the comma-separated string into an array and join it back with spaces (`", "`) on every keystroke, which interfered with the user's manual typing.

#### Fix Applied
Separated the "raw input string" state (`optionsRaw`) from the "parsed array" state. The raw string is preserved during typing, and the array is only updated on `onBlur` or Save.

#### Lesson Learned
⚠ BÀI HỌC #012: When handling complex string-to-array transformations in inputs (like CSV), always maintain a raw string state for the input field to prevent jumping or blocking characters.

---


### [BUG-011] — Data Desync & 404 between Web App and Extension
**Status**: CLOSED
**Severity**: HIGH
**Discovered**: [2026-05-01] | **Fixed**: [2026-05-01]

#### Symptom
Users logging into the Chrome Extension and the Web App with the same account see completely different data (separate Workspace spreadsheets). Furthermore, Drive images created by the Web App throw 404 errors in the Extension.

#### Root Cause
The `drive.file` scope restricts access only to files created by the EXACT SAME Google Cloud Client ID. Since the Web App (on Railway) uses a production Client ID and the Extension uses a local/different Client ID, they are effectively sandboxed from each other's Drive files despite using the same Google account.

#### Fix Applied
Added an `<img>` fallback in `DriveImage.tsx` that uses the public Google Drive thumbnail URL (`drive.google.com/thumbnail?id=`) when the authenticated API fetch fails. Because the extension runs in the browser, the browser's native cookies authenticate the image request without hitting the strict `drive.file` OAuth limit.
*Permanent Fix: Ensure VITE_GOOGLE_CLIENT_ID matches perfectly across all deployment environments.*

#### Lesson Learned
⚠ BÀI HỌC #011: `drive.file` scope is tied strictly to the Google Cloud Project / Client ID. If an architecture spans multiple platforms (Web, Extension, Mobile), they MUST share the same OAuth project origin to share files.

---

### [BUG-010] — Extension Drive Image 401/CORS Failure
**Status**: CLOSED
**Severity**: MEDIUM
**Discovered**: [2026-05-01] | **Fixed**: [2026-05-01]

#### Symptom
Drive images display perfectly in the Web App but show broken placeholders in the Chrome Extension's Data Tab.

#### Root Cause
The `chrome.identity.getAuthToken` caches tokens. When the token expires, the Web App's GSI automatically refreshes it, but the extension continues to use the cached, expired token. Fetching the image payload directly via `alt=media` using this expired token results in a 401 Unauthorized error.

#### Fix Applied
Updated `DriveImage.tsx` to handle 401 errors. Added logic to use `thumbnailLink` (which often bypasses strict auth for previews if constructed correctly) and instructed the user to click the extension icon to refresh the token if a hard 401 occurs. 
*Note: Extension side needs a token invalidation routine if 401 is encountered, but for now we prioritize thumbnail extraction.*

#### Lesson Learned
⚠ BÀI HỌC #010: Extensions using `chrome.identity` have different token lifecycles than Web Apps. Always handle 401s explicitly when fetching authenticated resources in an extension context.

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
| Total bugs logged | 28 |
| Open | 0 |
| Closed | 28 |
| Patterns extracted | 2 |
