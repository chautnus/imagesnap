---
id: proj_upload_perf_redesign_20260605
type: project
title: "Upload optimization & Light UI redesign decisions"
tags: [drive, upload, performance, cache, ui, light-mode, design-system]
keywords: [folder cache, base64 fetch, Promise.all, indigo, localStorage, fire-and-forget]
status: active
created: 2026-06-05
updated: 2026-06-05
summary: "Drive folder IDs cached 24h in localStorage + Map. Base64 decoded via fetch(). Images uploaded in parallel. Full light-mode palette applied. DataTab split into 4 modules."
---

## Upload Performance — Key Decisions

**Why folder caching?**
`findOrCreateFolder` made 1–2 API calls on every save. With 3-level hierarchy (root → category → product name), that's 3–6 API calls just for folder resolution before any image upload. Cache key: `imgsnap_fid_${parentId}::${name}`, TTL 24h.

**Why `fetch(dataUrl)` for base64 decode?**
The old `charCodeAt` loop creates an intermediate `Array` then copies to `Uint8Array` — O(n) in JS. `fetch(dataUrl)` delegates to the browser's native C++ decoder, ~10× faster for 1MB+ images.

**Why fire-and-forget for setPermissions?**
The permission call only makes the file publicly readable. This does not affect the returned `webViewLink` (which is always available post-upload). Awaiting it added ~200–400ms per image with no functional benefit to the caller.

**Why `Promise.all` for image uploads?**
Multiple images were uploaded sequentially despite having no data dependency on each other. Parallelism is safe here — each image gets its own filename and Drive location.

## Light Mode Design System

**Palette rationale:**
- `#F0F4FF` (indigo-50) as bg — not pure white (too stark on mobile), not gray (too flat). Slight blue tint matches the accent family.
- `#4F6EF7` (indigo-500) as accent — more distinctive than `#0078D7` (Windows blue), softer than `#2563EB`.
- `#E2E8F0` (slate-200) for lines — visible but not heavy.

**`label-meta` change:**
Old: `text-[18px] text-muted font-mono font-black uppercase tracking-[0.15em]` — designed for a terminal-aesthetic app.
New: `text-[11px] text-muted font-semibold uppercase tracking-[0.08em]` — labels are supporting text, not primary UI.

**How to apply in new components:**
- Cards: always `bg-card border border-line rounded-2xl shadow-sm`
- Primary actions: `btn btn-primary` (no custom shadow overrides)
- Labels above inputs: `label-meta` class
- Do NOT use `font-black` or `tracking-[0.15em]` for labels — reserved for emphasis only

## DataTab Architecture Post-Split

```
DataTab.tsx           ← state, view routing, layout toggle
  ├─ DataSearchBar    ← search input + filter panel
  ├─ DataProductCard  ← list card OR grid card (layout prop)
  └─ DataProductDetail← full-screen detail
```

`layout` state (`'list' | 'grid'`) persists to `localStorage('data_layout')`. Toggle button appears in `items` view and search results view. Category and names views intentionally have no toggle (they use fixed grid/list layouts appropriate to their content).
