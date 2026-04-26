# ImageSnap App Requirements & Changelog

## Core Objective
A powerful browser-based product cataloging application that captures photos, scrapes web images, and organizes them into a structured Google Drive/Sheets workspace.

## Version 1.2.0 Features (Current Release)

### 1. Data Structure & Storage
- **Backend**: Google Sheets (data) and Google Drive (images).
- **Workspace**: A spreadsheet named `ImageSnap Workspace`.
- **Image Thumbnails**: Optimized Drive thumbnail generation using `https://drive.google.com/thumbnail?id=ID&sz=w600` for 5x faster loading in the Data tab.
- **Naming Convention**: Images in the folder renamed to `[Key]-xxx.jpg`.

### 2. Usage Quota & Monetization
- **Free Tier**: 30 snaps per month limit.
- **PRO Tier**: Unlimited snaps, lifetime access via Stripe/Lemon Squeezy.
- **Real-time Tracking**: Usage is tracked server-side and synced across Web and Extension via `/api/increment-usage`.
- **Status Badges**: Plan status (FREE/PRO) and usage quota displayed live on Capture and Settings screens.

### 3. User Experience & Detail View
- **Max Legibility UI**: Base font sizes set to 16px (inputs) and 14px (secondary) for high readability on desktop and mobile.
- **Data Detail View**: Clicking a record reveals a text-based "Deep Dive" showing every saved field and a gallery of high-res images linking directly to Drive.
- **ActiveTab Security**: The browser extension uses programmatic injection (`chrome.scripting`) to respect user privacy and bypass "Broad Host Permission" review delays.

### 4. Image Capture & Scraping
- **Extension (Collector)**: Advanced image/metadata extraction with context-aware "activeTab" selection.
- **Camera**: Integrated camera with image strip review.
- **Bulk Import**: Support for pasting multiple URLs or receiving via `?import=` parameter.

### 5. Search & Filtering
- **Advanced Search**: Filter by Date, Category, Tags, and Author.
- **Dynamic Search**: Real-time filtering by product name and metadata.

---
*Last Updated: 2026-04-26*
