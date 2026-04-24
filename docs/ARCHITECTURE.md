# ImageSnap Architecture Guide

This project follows a modular, feature-based architecture to ensure maintainability and isolation of concerns.

## Core Principles
1. **One File Per Feature**: Each major functional area is isolated into its own file.
2. **Service Layer**: Business logic (Sheets API, Drive API coordination) resides in `src/services/`.
3. **Data Layer**: Low-level API abstractions are in `src/lib/`.
4. **UI Layer**: React components are in `src/components/`, focusing strictly on presentation and user interaction.
5. **Extension-First**: Core data collection is driven by the browser extension, with the PWA acting as the central management hub.

## File Map

### 📂 Root Directory
- `server.ts`: Full-stack Express server. 
  - **Image Proxy API** (`/api/proxy-image`): Bypasses CORS for remote image collection.
  - **Payment/Subscription**: Integrates with **Lemon Squeezy** for Pro billing.

### 📂 extension/
- `content_script.js`: **Browser Extension Content Script**. Scrapes metadata and images (categorized into MAIN, OTHERS, ICONS) from e-commerce sites.
- `background.js`: Manages extension lifecycle.
- `manifest.json`: Configuration for the "ImageSnap Collector" extension.

### 📂 src/
- `main.tsx`: React entry point.
- `App.tsx`: Main container, handles routing and OAuth flow.

### 📂 src/services/
- `productService.ts`: Manages products and image coordination between Sheets and Drive.
- `categoryService.ts`: Manages category lifecycle and schema.

### 📂 src/lib/
- `sheets.ts`: Google Sheets API wrappers.
- `drive.ts`: Google Drive API wrappers.
- `google-auth.ts`: Authentication state management.
- `i18n.ts`: Internationalization (English/Vietnamese).

### 📂 src/components/
- `CaptureTab.tsx`: Interface for product capturing, including the **Extension Snap** trigger.
- `SettingsTab.tsx`: Category management and Extension installation info.
- `DataTab.tsx`: Product history and data view.

## Integration Details

### 1. Payment & Pro Features
- **Provider**: **Lemon Squeezy**.
- **Flow**: User clicks Upgrade -> `create-checkout-session` API -> Redirect to Lemon Squeezy -> Webhook notifies `server.ts`.
- **Sync**: The frontend polls `/api/user-status` to unlock Pro features.

### 2. Image Proxy & CORS
- Direct `fetch` to remote images often fails due to CORS.
- `uploadUrlImage` in `src/lib/drive.ts` automatically falls back to the `/api/proxy-image` proxy on the server.
