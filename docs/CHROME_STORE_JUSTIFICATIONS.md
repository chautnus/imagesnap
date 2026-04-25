# Chrome Web Store Submission Justifications: ImageSnap

This document provides the text you need to copy-paste into the Chrome Developer Dashboard during the submission process.

## 1. Extension Description (Public)
**Summary:** Professional image & metadata collector for Google Drive.
**Detailed Description:**
ImageSnap is the ultimate productivity tool for e-commerce researchers, dropshippers, and designers. It allows you to "snap" product images and detailed metadata (titles, prices, descriptions) directly from any website and save them organized into specific Google Drive folders and Google Sheets.

Eliminate the messy "Downloads" folder. ImageSnap turns your web browsing into a structured data system.

## 2. Single Purpose Statement
ImageSnap serves a single, clear purpose: enabling users to capture web images and associated metadata directly to their personal Google Drive/Sheets for professional organization and research.

## 3. Permission Justifications

### `activeTab` / Host Permissions (`<all_urls>`)
**Justification:** ImageSnap requires access to the current page to identify and extract image URLs and metadata (like product titles) when the user triggers the extension. This is essential for the core functionality of "snapping" content from various e-commerce and inspiration websites.

### `storage`
**Justification:** Used to store user preferences, selected categories, and synchronization metadata locally. This ensures a fast and responsive UI without needing to re-fetch settings from the cloud on every popup open.

### `identity`
**Justification:** ImageSnap integrates directly with Google Drive. We use the `chrome.identity` API to securely authenticate the user via OAuth2, allowing them to grant the extension permission to save files directly into their own Google Drive account.

## 4. Privacy Disclosure (Data Usage)
**Q: What data are you collecting?**
A: We only collect the images and metadata (titles, URLs) that the user explicitly chooses to save. We also process the user's Google account email for authentication purposes.

**Q: How do you use the data?**
A: Data is processed locally in the browser and sent directly to the user's Google Drive/Sheets via official Google APIs. 

**Q: Do you sell the data?**
A: No. We do not sell user data to third parties.

**Q: Do you use the data for marketing?**
A: No.

**Q: Do you use the data for creditworthiness?**
A: No.

## 5. Script/Code Justification
ImageSnap is built using standard React and Vite. All logic is bundled locally within the extension package. We do NOT use remote-hosted code (Remote Scripts), complying with the latest Manifest V3 security policies.
