# ProjectSnap App Requirements & Changelog

## Core Objective
A mobile-first product cataloging application that captures photos, imports web images, and organizes them into a structured Google Drive/Sheets workspace.

## Confirmed Requirements

### 1. Data Structure & Storage
- **Backend**: Google Sheets (for data) and Google Drive (for images).
- **Workspace**: A shared spreadsheet named `ProductSnap Workspace`.
- **Image Hierarchy**: 
  - Root: `ProductSnap Images`
  - Level 1: `[Category Name]` (v.g. "Plants", "Pots")
  - Level 2: `[Key Field Value]` (Identifier folder)
- **Naming Convention**: Images in the Key folder must be renamed to `[Key]-xxx.jpg` (e.g., `POT123-001.jpg`).

### 2. Categorization System
- **Categories**: Users can define categories (e.g., Plants, Furniture).
- **Dynamic Fields**: Each category has custom fields (attributes).
- **Field Types**: `text`, `number`, `boolean`, `select`, `url`, `date`, `time`, `datetime`, and **`key`**.
- **Product Identity**: The default "Product Name" field has been removed. The value entered in the **Key** field now automatically serves as the Product Name.
- **Key Field Behavior**: 
  - Every category MUST have exactly one Key field.
  - The Key field is automatically positioned at the top of all forms.
  - The Key field value dictates the Google Drive subfolder name and the image filename prefix.

### 3. Image Capture & Import
- **Camera**: integrated in-app camera with image strip review.
- **Bulk Import**: Ability to paste multiple URLs or receive them via `?import=` URL parameter.
- **PS_Collector (Bookmarklet)**:
  - **Version 4**: Uses a sophisticated "Overlay Selection" UI to scan and pick specific images from any webpage.
  - **Security**: Designed to bypass "URI Too Long" and "403" errors by only sending selected URLs.
  - **Compatibility**: Recommends using the "Standalone Tab" for the most reliable connection on restricted browsing environments.

### 4. User Experience & Design
- **Theme**: "Bold Typography" (Clean black/white/accent scheme, Inter/Space Grotesk fonts).
- **Language**: Bilingual support (English & Vietnamese).
- **Auth**: Persistent Google Login (auto-connect if session exists).
- **Navigation**: Modern bottom bar with active states.
- **Standalone Mode**: Dedicated UI button to open the application in a separate tab to bypass iframe security.

### 5. Search & Filtering
- **Advanced Search**: Filter by Date Range, Category, Tags, and Author.
- **Dynamic Search**: Real-time filtering by product name and metadata.

---
*Last Updated: 2026-04-17*
