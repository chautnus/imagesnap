# ImageSnap Variables Audit (v1.8.8 Ultimate Sync)

This document catalogs the primary state variables, props, and constants used across the ImageSnap Web App and Chrome Extension.

## 1. Global & Shared State (Dashboard / App)

| Variable | Type | Source | Description |
| --- | --- | --- | --- |
| `user` | `User | null` | `page.tsx` / `App.tsx` | Current authenticated user profile from Google/Session. |
| `accessToken` | `string | null` | `google-auth.ts` | Bearer token for Google Sheets API interactions. |
| `spreadsheetId` | `string | null` | `localStorage` / `state` | ID of the linked Google Sheet (Workspace). |
| `activeTab` | `'capture' | 'data' | 'settings' | 'help'` | `page.tsx` / `App.tsx` | Controls the main UI navigation state. |
| `subStatus` | `SubscriptionStatus` | `useAppData` / `page.tsx` | Quota, usage, and Pro status info. |
| `shareTargetNonce` | `number` | `page.tsx` | Signals CaptureTab to pull shared data from IDB. |
| `isSyncing` | `boolean` | `useAppData` | Indicates active background sync with Google Sheets. |

## 2. Ingestion & Sharing Variables (Centralized in CaptureTab)

*Note: In v1.8.8, these variables are pulled directly from IDB by CaptureTab, not passed as props.*

| Variable | Type | Location | Description |
| --- | --- | --- | --- |
| `data.url` | `string` | `CaptureTab.tsx` | URL from a shared web page (extracted from IDB). |
| `data.title` | `string` | `CaptureTab.tsx` | Title from a shared page (extracted from IDB). |
| `data.text` | `string` | `CaptureTab.tsx` | Description/Text from a shared page (extracted from IDB). |
| `blobUrlsRef` | `MutableRefObject` | `CaptureTab.tsx` | Tracks all `blob:` URLs for memory cleanup. |
| `isSaving` | `boolean` | `CaptureTab.tsx` | UI lock state during API/Sheet submission. |

## 3. Component-Specific Variables (CaptureTab)

| Variable | Type | Description |
| --- | --- | --- |
| `images` | `string[]` | Local state of images being captured/imported in current session. |
| `formData` | `Record<string, any>`| Key-value store for metadata fields of the selected category. |
| `keyFieldId` | `string` | The ID of the field marked as 'key' for the active category. |

## 4. Service Worker (sw.js)

| Variable | Type | Description |
| --- | --- | --- |
| `DB_NAME` | `string` | `imagesnap-pwa-db` - Primary DB for cross-process image transfer. |
| `STORE_NAME` | `string` | `shares` - Object store for shared content. |

## 5. Storage Keys (localStorage / sessionStorage)

- `ps_access_token`: Google OAuth token.
- `ps_sheet_id`: Google Sheet ID.
- `ps_recent_cats`: JSON array of recently used category IDs.

---
*Last Updated: 2026-05-15 (v1.8.8)*
