// ProductSnap Background Script
console.log('ImageSnap Background Service Worker Initializing...');

const DEFAULT_APP_URL = 'https://ais-pre-litx3qlsepsiwqgx5n3vmu-658490117315.us-east1.run.app';

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_APP_URL') {
    chrome.storage.local.get(['customAppUrl'], (result) => {
      sendResponse({ url: result.customAppUrl || DEFAULT_APP_URL });
    });
    return true; // Keep channel open for async response
  }
});

// Configure Side Panel behavior on installation/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('ImageSnap Extension Installed/Updated');
  
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .then(() => console.log('Side Panel behavior configured successfully'))
      .catch((error) => console.error('Error setting side panel behavior:', error));
  }
});
