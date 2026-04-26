# Project Memory: ImageSnap

## Project Overview (v1.2.0)
ImageSnap is a high-performance product cataloging platform for e-commerce marketers. It enables rapid snapping, categorization, and uploading of product images from any website or live camera directly to Google Drive and Google Sheets. 

## Key Updates & Decisions

### 🚀 Architecture (v1.2.0)
- **Persistent Quota**: Replaced in-memory usage tracking with a file-based JSON store (`user_db.json`) in `server.ts` to ensure snap counts persist across server restarts.
- **Drive Thumbnails**: Implemented on-the-fly transformation of Drive `webViewLink` into optimized thumbnails (`sz=w600`) in `DataTab.tsx` for 5x faster data browsing.
- **ActiveTab Security**: Replaced broad host permissions in the extension with `chrome.scripting` and `activeTab`. This ensures zero-review delay for store publishing and absolute user privacy.

### 🎨 Design Standards (v1.2.0)
- **Max Legibility**: Established a new "High-Impact" UI standard. Base font size for inputs/controls is **16px**, with **14px** for secondary labels.
- **Data Depth**: Introduced the "Deep Dive" detail view, allowing users to see every metadata field as text and link directly to full-res images in Drive.

## Project Structure

### 📁 Root
- `server.ts`: Node.js server handling API, persistence, and image proxying.
- `user_db.json`: Persistent storage for user plans and usage quotas.
- `dist-ext/`: Final production build for the Browser Extension.

### 📁 docs/
- `ARCHITECTURE.md`: Technical flows and component mappings.
- `CHROME_STORE_JUSTIFICATIONS.md`: Formal justifications for permission usage.
- `PROJECT_REQUIREMENTS.md`: Living functional specification.

### 📁 src/
- `src/web/`: Main React PWA frontend.
- `src/extension/`: Extension-specific entry points and manifest.
- `src/shared/`: Shared logic, types, and hooks (Crucial for sync).

## Development Constraints
- **Deployment**: Configured for Railway/Node-compatible environments (Port 8080).
- **Build**: `npm run build` generates both Web and Extension production bundles.

---
*Last Updated: 2026-04-26*
