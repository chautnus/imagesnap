# Chrome Web Store Submission Justifications: ImageSnap

This document provides the text you need to copy-paste into the Chrome Developer Dashboard during the submission process.

## 1. Single Purpose Statement
**Question:** Does your extension have a single purpose?
**Answer:** Yes.
**Justification:** ImageSnap serves a single, clear purpose: enabling users to capture web images and associated metadata directly to their personal Google Drive/Sheets for professional organization and research.

## 2. Permission Justifications

### `tabs` Permission
**Justification:** ImageSnap requires the `tabs` permission to facilitate communication between the extension's popup and the content script injected into the webpage. This allows the extension to query the active tab for specific image data and metadata elements (like product titles or prices) that the user wishes to save.

### `activeTab` & Host Permissions (`<all_urls>`)
**Justification:** ImageSnap needs to access the content of the webpage the user is currently viewing to identify and extract image assets. The `<all_urls>` permission is required because users need to collect assets from a wide variety of e-commerce, portfolio, and inspiration websites across the internet. Access is only triggered when the user explicitly interacts with the extension.

### `storage`
**Justification:** Used to store user configuration, custom categories, and local synchronization status. This ensures the extension remembers user settings and provides a seamless offline-to-online experience.

### `identity`
**Justification:** ImageSnap uses the `chrome.identity` API to securely authenticate users via OAuth2. This is necessary to obtain authorized access tokens to save files directly into the user's personal Google Drive account.

## 3. Remote Code Policy
**Question:** Are you using remote code?
**Answer:** No.
**Justification:** ImageSnap does not use any remote-hosted scripts or libraries. All code, including React components and utility libraries, is bundled locally within the extension package. This ensures compliance with Manifest V3 security requirements and protects user privacy.

## 4. User Data Privacy & Collection

### Data Collection Disclosure
**What user data do you plan to collect from users now or in the future?**
ImageSnap collects and processes the following data only when triggered by the user:
1. **User Identity:** User's Google email address (for authentication and Drive access).
2. **Web Content:** Image URLs, product titles, descriptions, and source links explicitly selected by the user for saving.
3. **Usage Data:** Local settings and category configurations created by the user within the app.

### Privacy Policy URL
**Privacy Policy URL:** `https://imagesnap.cloud/privacy` (or your GitHub Pages/hosting link)

## 5. Privacy Disclosure (Data Usage)
**Q: How do you use the data?**
A: Data is processed locally and sent directly to the user's Google Drive via official APIs. We do not store user-captured content on our servers.

**Q: Do you sell the data?**
A: No. We do not sell user data to third parties.

**Q: Do you use the data for marketing?**
A: No.
