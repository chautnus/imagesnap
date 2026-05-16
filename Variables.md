# ImageSnap Global Variables Audit (v1.8.9)

This document provides a full audit of variables used across the platform, divided into Declarations (Part 1) and Usage (Part 2) to ensure architectural integrity.

---

## Part 1: Declared Variables (Definitions)

### 1. Dashboard (page.tsx)
- `shareTargetNonce`: (State) Signals CaptureTab to pull shared data.
- `initStage`: (State) Tracks boot sequence (IDLE, DATA_READ, etc.).
- `user`, `isAuthReady`, `spreadsheetId`, `subStatus`, `masterSpreadsheetId`: (State) Core auth/quota states.
- `logs`, `isVisible`: (State) Debug overlay controls.
- `dataStatus`, `isOffline`: (State) Network/Sync status.

### 2. CaptureTab (CaptureTab.tsx)
- `images`: (State) Current batch of captured/imported images.
- `formData`: (State) Metadata for the active category.
- `selectedCategoryId`: (State) Active category ID.
- `searchTerm`, `recentCatIds`: (State) Category selection helpers.
- `isSaving`, `isExtracting`: (State) UI lock flags.
- `keySearchFocus`, `showPicker`, `extractedImages`: (State) Web extraction UI states.
- `blobUrlsRef`: (Ref) Memory management for blob: URLs.

### 3. Extension Entry (App.tsx)
- `shareTargetNonce`: (State) **(New in v1.8.9)** Syncs with CaptureTab.
- `activeTab`, `isAuthReady`, `view`, `user`, `isStaff`, `spreadsheetId`, `subStatus`: (State) Core platform states.
- `sharedMetadata`: (State) Legacy metadata buffer.

### 4. Service Worker (sw.js)
- `CACHE_NAME`: (Const) PWA Cache versioning.
- `DB_NAME`, `STORE_NAME`, `DB_VERSION`: (Const) IndexedDB configuration.

---

## Part 2: Used Variables (Call Sites)

### 1. Successful Matches (Declared & Used)
- `shareTargetNonce` -> Used in `page.tsx`, `App.tsx`, and `CaptureTab.tsx`.
- `images`, `formData` -> Used throughout `CaptureTab.tsx`.
- `user`, `spreadsheetId` -> Used in `page.tsx` and passed to `useAppData`.

### 2. Discrepancies (The "Call Site" Audit)

| Variable | Status | Source | Resolution |
| --- | --- | --- | --- |
| `setSharedImages` | **ORPHAN** | `App.tsx` (L141) | **Removed in v1.8.9**. Logic moved to IDB. |
| `setImportedImages` | **ORPHAN** | `App.tsx` (L199, L234) | **Removed in v1.8.9**. Logic moved to IDB. |
| `setImportedUrl` | **ORPHAN** | `App.tsx` (L201, L237) | **Removed in v1.8.9**. Logic moved to IDB. |
| `setImportedMetadata` | **ORPHAN** | `App.tsx` (L204, L241) | **Removed in v1.8.9**. Logic moved to IDB. |
| `sharedMetadata` | **REDUNDANT** | `App.tsx` | Removed from Prop chain; internal to CaptureTab. |

---

## Part 3: Discrepancy Resolution Log

- **Build Stability**: All "Orphan" calls in `App.tsx` have been replaced with a unified `saveToIDB` and `setShareTargetNonce` signal.
- **Type Safety**: `FieldDefinition.keepValue` usage in `CaptureTab.tsx` reverted to type-based check to match `src/shared/lib/types.ts`.
- **Database Consistency**: All modules now use `imagesnap-pwa-db` (v2) and store `shares`.

*Last Audit: 2026-05-15 (v1.8.9)*
