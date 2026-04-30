# Project Memory: ImageSnap

## Project Overview (v1.3.1)
ImageSnap is a high-performance product cataloging platform for e-commerce marketers. It enables rapid snapping, categorization, and uploading of product images from any website or live camera directly to Google Drive and Google Sheets. 

## Key Updates & Decisions

### 🚀 Architecture (v1.3.1)
- **Centralized Header**: Unified user information (Role, Email, Quota) and version tracking into a global `Header` component for absolute UI consistency.
- **In-App Documentation**: Introduced `HelpTab` and integrated it into the main navigation to eliminate external redirects and maintain user context.
- **Persistent Quota**: Replaced in-memory usage tracking with a file-based JSON store (`user_db.json`) in `server.ts`.

### 🎨 Design Standards (v1.3.1)
- **High-Impact UI**: Established a new standard with base font size **16px** for inputs and **14px** for secondary labels.
- **Information Density**: Refined `CaptureTab` to remove redundant information, focusing on actionable controls and high-speed snapping.

## Project Structure

### 📁 Root
- `server.ts`: Node.js server handling API, persistence, and image proxying.
- `user_db.json`: Persistent storage for user plans and usage quotas.
- `dist-ext/`: Final production build for the Browser Extension.

### 📁 docs/
- `ARCHITECTURE.md`: Technical flows and component mappings.
- `BUGLOG.md`: Detailed bug & fix knowledge base.
- `DEVLOG.md`: Weekly development milestone tracking.

### 📁 src/
- `src/web/`: Main React PWA frontend.
- `src/extension/`: Extension-specific entry points and manifest.
- `src/shared/`: Shared logic, types, and hooks (Crucial for sync).

## Development Constraints
- **Deployment**: Configured for Railway/Node-compatible environments (Port 8080).
- **Build**: `npm run build` generates both Web and Extension production bundles.

---
*Last Updated: 2026-04-30*
