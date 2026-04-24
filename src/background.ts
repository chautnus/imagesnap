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

// Handle extension icon click to open the app
chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get(['customAppUrl'], (result: { [key: string]: any }) => {
    chrome.tabs.create({ url: (result.customAppUrl as string) || DEFAULT_APP_URL });
  });
});
