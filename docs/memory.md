# Project Memory: ImageSnap

## Project Overview (v1.11.9)
ImageSnap is a high-performance product cataloging platform for e-commerce marketers. It enables rapid snapping, categorization, and uploading of product images from any website or live camera directly to Google Drive and Google Sheets.

## Key Updates & Decisions

### 🔒 Security Hardening (v1.11.9 — 2026-05-31)
- **bcrypt passwords**: Staff account passwords hashed with bcrypt (cost 12) on creation and login. Existing plaintext passwords must be reset by admin to migrate.
- **CORS fix**: `Access-Control-Allow-Credentials: true` is never sent with `Access-Control-Allow-Origin: *` (spec violation). Credentials header only applied to specific extension origins.
- **Rate limiting**: `authLimiter` (10 req/15min) on `/api/auth/staff-login`; `adminLimiter` (60 req/min) on `/api/admin/*`.
- **ADMIN_EMAILS env var**: Admin email list is now loaded from `process.env.ADMIN_EMAILS` (comma-separated). Fallback to hardcoded list if env var not set.
- **Removed hardcoded SQL**: Deleted auto-admin grant query from `initDb()` in `src/db-postgres.ts`.
- **Removed Stripe**: Cleaned up unused Stripe dependency; payment is handled by Lemon Squeezy.

### 🌐 SEO Expansion (v1.11.9 — 2026-05-31)
8 new content pages targeting validated user pain points (from user research):
- **Use Cases**: `/use-cases/aliexpress-product-research`, `/use-cases/shopify-competitor-tracking`
- **Blog**: `/blog/swipe-file-chaos-how-to-fix`, `/blog/organize-product-images-ecommerce`, `/blog/google-drive-metadata-images`
- **Alternatives**: `/alternatives/foreplay-alternative`, `/alternatives/magicbrief-alternative`, `/alternatives/dam-alternative-google-drive`

All pages follow the `SEOPage` component pattern and are registered in both Next.js (`app/[segment]/[slug]/page.tsx`) and Vite/Extension (`src/web/routes/PublicRoutes.tsx`).

### 🚀 Architecture (v1.11.7)
- **Runtime Environment Variables**: All Postgres connection strings read via bracket notation (`process.env['DATABASE_URL']`) to prevent Webpack static replacement.
- **Dynamic connection check**: `getDatabaseUrl()` called at query time, not at module load time.

### 🚀 Architecture (v1.3.1)
- **Centralized Header**: Unified user information (Role, Email, Quota) and version tracking into a global `Header` component.
- **In-App Documentation**: `HelpTab` integrated into main navigation.
- **Persistent Quota**: PostgreSQL database (replaced `user_db.json`).

### 🎨 Design Standards (v1.3.1)
- Base font size: **16px** for inputs, **14px** for secondary labels.

## Project Structure

### 📁 Root
- `server.ts`: Express server — API, auth, proxy, payments, webhooks.
- `ANTIGRAVITY.md`: Session context / short-term memory for agents.

### 📁 app/ (Next.js App Router — SSR/SSG)
- `app/use-cases/[slug]/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/alternatives/[slug]/page.tsx`

### 📁 src/
- `src/web/`: React SPA for Chrome extension side panel (Vite build).
- `src/web/routes/PublicRoutes.tsx`: Route registry for Vite/Extension build.
- `src/web/pages/`: Page components (use-cases, blog, alternatives, landing).
- `src/extension/`: Extension-specific entry points and manifest.
- `src/shared/`: Shared logic, types, hooks.
- `src/db.ts`: User/config CRUD operations.
- `src/db-postgres.ts`: PostgreSQL pool and schema initialization.

### 📁 docs/
- `ARCHITECTURE.md`: Technical flows and component mappings.
- `BUGLOG.md`: Detailed bug & fix knowledge base.
- `DEVLOG.md`: Weekly development milestone tracking.
- `memory/Revisit imagesnap opportunity.md`: User research report (2026-05-31).
- `ImageSnap SEO/SEO imagesnap 30May2026.md`: SEO implementation plan (2026-05-31).

## Critical Architectural Rules

### Dual Build Pipeline
Every public page MUST be registered in two places:
1. `app/[segment]/[slug]/page.tsx` — Next.js SSR
2. `src/web/routes/PublicRoutes.tsx` — Vite/Extension SPA

### Staff Password Security
- New staff: `bcrypt.hash(password, 12)` before INSERT
- Staff login: `bcrypt.compare(password, hash)` then `const { password: _pw, ...safeUser } = userEntry` before JSON response
- Existing staff with plaintext passwords: admin must reset via `/api/admin/update-user`

## Development Constraints
- **Deployment**: Vercel (production), Railway (legacy).
- **Build**: `npm run build:web` (Next.js) + `npm run build:ext` (Vite extension).
- **Node**: >=18.0.0

## Key Dependencies
```
next: ^16.2.4          react: ^19.0.0
pg: ^8.20.0            bcrypt: ^6.0.0
express-rate-limit: ^8.5.2
@lemonsqueezy/lemonsqueezy.js: ^4.0.0
```

---
## Domain Indexes

| Domain | Path | Index |
|--------|------|-------|
| Project decisions | `docs/memory/project/` | [INDEX.md](memory/project/INDEX.md) |
| Changelog | `docs/changelog/` | [INDEX.md](changelog/INDEX.md) |
| PRD | `docs/prd/` | (browse directly) |

---
*Last Updated: 2026-05-31 — v1.11.9*
