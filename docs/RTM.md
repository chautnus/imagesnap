# RTM.md - REQUIREMENT TRACEABILITY MATRIX

| BR ID | Requirement | ARCH Ref | Files | Tests | Risk | Last Changed | CI Status | Status |
|-------|-------------|----------|-------|-------|------|--------------|-----------|--------|
| BR-1.1 | Data Storage | ARCH-2.3 | `src/shared/lib/sheets.ts`, `src/shared/lib/drive.ts` | N/A | High | 2026-04-28 | Passed | Active |
| BR-1.1.3 | Naming Conv | ARCH-2.3 | `src/shared/services/productService.ts` | N/A | Low | 2026-04-28 | Passed | Active |
| BR-1.2 | Performance (Img Quality) | ARCH-2.2 | `src/extension/content_script.js` | N/A | Low | 2026-04-27 | Passed | Active |
| BR-1.2.1 | Thumbnail Optimize | ARCH-2.3 | `src/web/components/DataTab.tsx` | N/A | Low | 2026-04-28 | Passed | Active |
| BR-2.1 | Sub Tiers | ARCH-2.1 | `server.ts` | N/A | Med | 2026-04-27 | Passed | Active |
| BR-2.2 | Payment | ARCH-2.1 | `server.ts` | N/A | High | 2026-04-27 | Passed | Active |
| BR-3.1 | Extension | ARCH-2.2 | `src/extension/*`, `src/shared/services/dataService.ts` | N/A | Med | 2026-04-28 | Passed | Active |
| BR-3.2 | Camera | ARCH-2.4 | `src/web/components/CaptureTab.tsx` | N/A | Low | 2026-04-28 | Passed | Active |
| BR-3.3 | Bulk Import | ARCH-2.3 | `src/web/App.tsx`, `src/web/components/Wizard.tsx` | N/A | Low | 2026-04-27 | Passed | Active |
| BR-4.1 | UI Standards | ARCH-2.4 | `src/web/index.css` | N/A | Low | 2026-04-28 | Passed | Active |
| BR-4.2 | Search | ARCH-2.4 | `src/web/components/DataTab.tsx` | N/A | Low | 2026-04-27 | Passed | Active |
| BR-1.3 | Centralized Storage | ARCH-2.1 | `server.ts`, `useAppData.ts` | N/A | High | 2026-04-28 | Passed | Active |
| BR-2.3 | Staff Login & Permissions | ARCH-2.1 | `server.ts`, `StaffLogin.tsx` | `tests/staff_login.spec.ts` | Med | 2026-04-27 | Passed | Active |
| BR-3.4 | Quick Category Creation | ARCH-2.4 | `CaptureTab.tsx`, `App.tsx` | N/A | Low | 2026-04-27 | Passed | Active |
| BR-5.1 | Chrome Store Compliance | ARCH-5 | `manifest.json`, `index.html` | N/A | High | 2026-04-28 | Passed | Active |
| BR-5.2 | Automated Testing | ARCH-5 | `playwright.config.ts`, `tests/*` | `npm test` | Low | 2026-04-27 | Passed | Active |

