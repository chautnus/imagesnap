# ImageSnap Variables Audit (v1.8.6)

This document catalogs the primary state variables, props, and constants used across the ImageSnap Web App and Chrome Extension.

## 1. Global & Shared State (Dashboard / App)

| Variable | Type | Source | Description |
| --- | --- | --- | --- |
| `user` | `User | null` | `page.tsx` / `App.tsx` | Current authenticated user profile from Google/Session. |
| `accessToken` | `string | null` | `google-auth.ts` | Bearer token for Google Sheets API interactions. |
| `spreadsheetId` | `string | null` | `localStorage` / `state` | ID of the linked Google Sheet (Workspace). |
| `activeTab` | `'capture' | 'data' | 'settings' | 'help'` | `page.tsx` / `App.tsx` | Controls the main UI navigation state. |
| `subStatus` | `SubscriptionStatus` | `useAppData` / `page.tsx` | Quota, usage, and Pro status info. |
| `shareTargetNonce` | `number` | `page.tsx` | **(New v1.8.6)** Signals CaptureTab to pull shared data from IDB. |
| `isSyncing` | `boolean` | `useAppData` | Indicates active background sync with Google Sheets. |
| `isOffline` | `boolean` | `page.tsx` | Network status indicator. |

## 2. Ingestion & Sharing Variables (PWA/Extension)

| Variable | Type | Location | Description |
| --- | --- | --- | --- |
| `importedUrl` | `string` | `page.tsx` / `App.tsx` | URL from a shared web page. |
| `importedMetadata` | `ProductMetadata` | `page.tsx` / `App.tsx` | Title/Description/Price from a shared page. |
| `sharedImages` | `string[]` | `App.tsx` | **(Legacy)** Blobs in RAM for Extension. |
| `blobUrlsRef` | `MutableRefObject` | `CaptureTab.tsx` | **(New v1.8.6)** Tracks all `blob:` URLs for memory cleanup. |
| `lastProcessedId` | `string` | `sessionStorage` | Idempotency key to prevent double-processing shares. |

## 3. Component-Specific Variables (CaptureTab)

| Variable | Type | Description |
| --- | --- | --- |
| `images` | `string[]` | Local state of images being captured/imported in current session. |
| `selectedCategoryId`| `string | null` | Currently selected category for organization. |
| `formData` | `Record<string, any>`| Key-value store for metadata fields of the selected category. |
| `isSaving` | `boolean` | UI lock state during API/Sheet submission. |
| `recentCatIds` | `string[]` | Top 5 most used categories (stored in `localStorage`). |

## 4. Service Worker (sw.js)

| Variable | Type | Description |
| --- | --- | --- |
| `CACHE_NAME` | `string` | Current version of the PWA cache (e.g., `imagesnap-v8.6`). |
| `sid` | `string` | Unique Share ID generated for every ingestion event. |
| `DB_NAME` | `string` | `ImageSnapSharing` - Primary DB for cross-process image transfer. |

## 5. Storage Keys (localStorage / sessionStorage)

- `ps_access_token`: Google OAuth token.
- `ps_sheet_id`: Google Sheet ID.
- `ps_recent_cats`: JSON array of recently used category IDs.
- `imagesnap_last_share_id`: Idempotency key for Share Target.
- `migration_v1_6_1`: Flag for legacy SW cleanup.

---
*Last Updated: 2026-05-15 (v1.8.6)*
