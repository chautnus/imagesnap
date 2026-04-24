# Project Memory: ImageSnap

## Project Overview
ImageSnap is a full-stack web application designed for e-commerce marketers to quickly snap, categorize, and upload product images from any website to Google Drive and Google Sheets. It includes a Chrome Extension for data collection and a dashboard for management.

## Project Structure

### 📁 Root
- `server.ts`: Express server (Node.js) handling API requests, image proxying, and Lemon Squeezy webhooks.
- `package.json`: Main project configuration with dependencies for both frontend and backend.
- `vite.config.ts`: Vite configuration for the React frontend.
- `index.html`: Entry point for the React application.

### 📁 docs/
- `memory.md`: This file. High-level project structure and context.
- `ARCHITECTURE.md`: Detailed technical architecture, data flows, and component descriptions.
- `PROJECT_REQUIREMENTS.md`: Functional and non-functional requirements.

### 📁 src/ (Frontend)
- `App.tsx`: Main React component and routing.
- `main.tsx`: React entry point.
- `src/components/`: Reusable UI components.
- `src/services/`: Client-side logic for interacting with APIs (Drive, Sheets, Search).
- `src/lib/`: Utility libraries and API wrappers.

### 📁 extension/ (Browser Extension)
- `manifest.json`: Extension configuration.
- `content_script.js`: Logic for scraping web pages.
- `popup.html` / `popup.js`: Extension UI.

### 📁 scripts/
- `zip-extension.js`: Script to package the extension for distribution.

## Key Technologies
- **Frontend**: React 19, Tailwind CSS, Lucide icons, Motion (Framer Motion).
- **Backend**: Node.js, Express.
- **APIs**: Google Drive, Google Sheets, Lemon Squeezy (Payments), Google Gemini (AI Categorization).
- **Tooling**: Vite, TypeScript, tsx.

## Development Constraints
- Port: `8080` (configured for deployment).
- Start Command: `node --import tsx/esm server.ts`.
