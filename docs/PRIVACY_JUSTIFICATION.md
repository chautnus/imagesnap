# Chrome Extension Permission Justification

This document provides justifications for the permissions requested by the ImageSnap Chrome Extension (v1.4.0) for the Chrome Web Store review process.

## Permissions

### `identity`
**Justification:** Required to authenticate users with their Google account via OAuth2. This allows the extension to securely access the user's Google Sheets and Google Drive to save snapped images and metadata.

### `activeTab`
**Justification:** Needed to access the content of the currently active website when the user clicks the extension icon or uses the side panel. It is used to extract image URLs and relevant product metadata (titles, descriptions, prices) for the "snap" functionality.

### `scripting`
**Justification:** Used to inject a lightweight content script into the active tab. This script performs the extraction of image assets and DOM-based metadata that the user wishes to save to their cloud storage.

### `sidePanel`
**Justification:** Enables the primary user interface of ImageSnap to be displayed in the Chrome side panel. This provides a persistent and convenient workspace for users to organize their research without switching tabs or losing focus.

### `storage`
**Justification:** Used to store non-sensitive local preferences, such as the user's language selection, UI state, and temporary session identifiers to maintain a consistent experience between browser restarts.

## Host Permissions

### `https://sheets.googleapis.com/*` & `https://www.googleapis.com/drive/*`
**Justification:** Necessary for the core functionality of the app: saving data directly to the user's own Google Sheets and uploading images to their Google Drive folders.

### `https://www.imagesnap.cloud/*`
**Justification:** Used to verify the user's subscription status (Pro vs Free) and to track usage limits as per our service terms.

### `*://*/*`
**Justification:** ImageSnap is a general-purpose research tool that allows users to capture assets from any website. Broad host permissions are required to enable the "snap" feature on the vast variety of sites our users visit for product research, competitive analysis, and creative inspiration.

## Remote Code Policy
The extension does **not** load or execute any remote code. All logic is bundled within the extension package. Google GSI scripts are only loaded in the web application context, not within the extension's background or content scripts.
