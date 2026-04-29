# ImageSnap App Requirements & Changelog

## Core Objective
A powerful browser-based product cataloging application that captures photos, scrapes web images, and organizes them into a structured Google Drive/Sheets workspace.

## Version 1.2.4 Features (Current Release)

### 1. Data Structure & Storage
- **Backend**: Google Sheets (data) and Google Drive (images).
- **Workspace**: A spreadsheet named `imagesnap.xlsx` (unified naming).
- **Storage Folder**: Unified root folder named `ImageSnap` on Google Drive for both Web and Extension.
- **Image Thumbnails**: Optimized Drive thumbnail generation for 5x faster loading in the Data tab.
- **Naming Convention**: Images in the folder named `[Key]-xxx.jpg`.

### 2. Usage Quota & Monetization
- **Free Tier**: 30 snaps per month limit.
- **PRO Tier**: Unlimited snaps, lifetime access via Stripe/Lemon Squeezy.
- **Real-time Tracking**: Usage is tracked server-side and synced across Web and Extension.

### 3. User Experience & Compliance
- **Max Legibility UI**: Base font sizes set to 16px (inputs) and 14px (secondary).
- **Chrome Store Compliance**: 
    - Removed all remotely hosted code (prohibited GAPI scripts).
    - Minimalist permissions: Removed unused `storage` permission.
    - Local assets: All fonts and logic are bundled locally.
- **Data Detail View**: "Deep Dive" showing every saved field and a gallery of high-res images.

### 4. Image Capture & Camera
- **Extension (Collector)**: Advanced image/metadata extraction with "activeTab".
- **Burst Cam (In-App)**: Custom camera supporting continuous rapid shooting, shutter flash effect, session counter, and last-shot preview. Optimized for mobile viewports with hardware control support (Zoom slider and Torch/Flash toggle).

- **App Camera (Native)**: Integrated access to the device's native camera app for full hardware support (Zoom, Auto-focus, Macro).
- **Screenshots & Sequential Native Shooting**: Users are encouraged to take multiple photos/screenshots natively and use the **GALLERY** feature for bulk import, as it preserves full hardware quality and allows multiple selection.
- **Mobile Optimization**: Fixed viewport height issues using `fixed inset-0` and `min-h-0` to ensure controls are always anchored and visible.


### 5. Search & Filtering
- **Advanced Search**: Filter by Date, Category, Tags, and Author.
- **Dynamic Search**: Real-time filtering by product name and metadata.

---
*Last Updated: 2026-04-28*
