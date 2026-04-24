
function upgrade(u) {
  if (!u) return u;
  if (u.includes('down-cv.img.susercontent.com') || u.includes('down-vn.img.susercontent.com')) {
    if (u.includes('@resize')) return u.replace(/@resize_w\d+.*$/, '@resize_w800_nl'); 
    return u.replace(/_tn$/, '').replace(/_zoom$/, '').replace(/_(\d+)x(\d+)$/, '');
  }
  if (u.includes('alicdn.com')) return u.replace(/_\d+x\d+.*\.jpg$/, '').replace(/_\d+x\d+.*\.png$/, '');
  return u.replace(/\/(thumb|thumbnail|small|sq|mini)\//i, '/original/');
}

function extractImages() {
  const groups = { 'MAIN': [], 'OTHERS': [], 'ICONS': [] };
  const allUrls = new Set();
  
  document.querySelectorAll('img').forEach((el) => {
    let s = el.currentSrc || el.src;
    if (!s || !s.startsWith('http')) return;
    s = upgrade(s);
    if (allUrls.has(s)) return;
    allUrls.add(s);

    const w = el.naturalWidth || el.width;
    const h = el.naturalHeight || el.height;
    
    let group = 'OTHERS';
    if (w < 50 || h < 50) group = 'ICONS';
    else if (el.closest('[class*="product-single"], [class*="pdp"], [class*="product-main"], [id*="main-image"]')) group = 'MAIN';
    else if (w > 400 || h > 400) group = 'MAIN';

    groups[group].push(s);
  });

  const metadata = {};
  try {
    metadata.t = document.querySelector('meta[property="og:title"]')?.content || document.title;
    metadata.p = document.querySelector('meta[property="og:price:amount"]')?.content || "";
    let d = "";
    [".pdp-product-detail", "._2u0n77", ".product-details__description", "#product-description"].forEach((s) => {
      const e = document.querySelector(s); if (e && !d) d = e.innerText;
    });
    if (!d) d = document.querySelector('meta[property="og:description"]')?.content || "";
    metadata.d = d.slice(0, 1000);
  } catch (e) {}

  return { groups, metadata, url: window.location.href };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    sendResponse(extractImages());
  }
  return true;
});
