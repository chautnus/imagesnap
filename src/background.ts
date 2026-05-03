// ProductSnap Background Script
console.log('ProductSnap Background Service Worker Active');

// Default App URL - users can ideally change this in options if they have their own deployment
const DEFAULT_APP_URL = 'https://ais-pre-litx3qlsepsiwqgx5n3vmu-658490117315.us-east1.run.app';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_APP_URL') {
    chrome.storage.local.get(['customAppUrl'], (result: { [key: string]: any }) => {
      sendResponse({ url: (result.customAppUrl as string) || DEFAULT_APP_URL });
    });
    return true; // Keep channel open for async response
  }
});

// Handle extension icon click to open the app (Side Panel)
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  console.log('ImageSnap Collector Extension installed - Side Panel enabled');
});
