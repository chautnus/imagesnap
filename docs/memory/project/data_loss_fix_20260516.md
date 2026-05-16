---
id: proj_data_loss_fix_20260516
type: project
title: "Data Loss Bug Fixes — Categories & Staff Workspace (v1.10.7)"
tags: [data-integrity, sheets, staff-auth, workspace, bug-fix]
keywords: [getSheetRows, useAppData, refreshData, masterSpreadsheetId, StaffLogin, session-cookie, findOrCreateWorkspace]
status: active
created: 2026-05-16
updated: 2026-05-16
summary: "Fixed 3 root causes of category/data loss: API error swallowing in getSheetRows, false-empty init in useAppData, and staff workspace misalignment on fresh devices."
---

## Why

Users reported categories and data disappearing. Root cause analysis identified three independent failure paths — not a single bug.

## What

### Fix 1 — `src/shared/lib/sheets.ts`: `getSheetRows` error discrimination

**Before:** Caught ALL errors and returned `[]`, so 403/500/network failures looked like empty sheets.

**After:** Only returns `[]` for `status === 400` (invalid range) or `status === 404` (missing sheet tab). All other errors are re-thrown, propagating to the caller's catch block.

`sheetsRequest` now attaches `err.status = response.status` before throwing.

### Fix 2 — `src/shared/hooks/useAppData.ts`: Guard against false-empty init

**Before:** If `data.categories.length === 0`, seeded default categories (Plants, Pots) unconditionally — even if the user deliberately deleted them.

**After:** Defaults only seeded when `categories.length === 0 && productNames.length === 0`. If productNames exist, the workspace is not new — do not overwrite.

Catch block now logs `[REFRESH_ERROR]` and preserves existing state instead of silently failing.

### Fix 3 — Staff workspace misalignment (multi-file fix)

**Problem:** Staff on a fresh device had no `ps_sheet_id` in localStorage → `useDashboardInit` called `initializeWorkspace()` → `findOrCreateWorkspace()` created a new blank spreadsheet on the staff member's personal Drive instead of connecting to the Admin's master sheet.

**Session cookie was also never set** for staff — `POST /api/auth/session` was not called after staff login, so page refresh logged them out.

**Files changed:**

- **`src/web/components/StaffLogin.tsx`** (`handleSubmit`):
  - After successful login, saves `data.masterSpreadsheetId` to `localStorage` as `ps_sheet_id`
  - Calls `POST /api/auth/session` to set the HTTP-only cookie with `role: 'staff'` and `masterSpreadsheetId`

- **`app/api/auth/session/route.ts`** (POST handler):
  - Now accepts and stores `masterSpreadsheetId` in the session payload

- **`app/dashboard/hooks/useDashboardInit.ts`** (`handleInit`):
  - When `profile.role === 'staff' && profile.masterSpreadsheetId`, overrides `storedId` with the master sheet ID and updates localStorage
  - Staff no longer falls through to `initializeWorkspace()`

## How to apply

- When debugging data loss, check browser console for `[REFRESH_ERROR]` (API failure) vs `[DATA_INIT]` (genuine empty workspace).
- Staff auth flow now: `POST /api/auth/staff-login` → `POST /api/auth/session` → cookie set → dashboard loads → session cookie provides `masterSpreadsheetId`.
- If a staff member reports wrong workspace, check `localStorage.ps_sheet_id` and the session cookie payload.
