
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
  const imageList = [];
  const allUrls = new Set();
  
  document.querySelectorAll('img').forEach((el) => {
    // Try to get the highest resolution URL
    let s = el.currentSrc || el.src;
    
    // Check for srcset (take the last/largest one)
    if (el.srcset) {
      const srcsetArr = el.srcset.split(',').map(s => s.trim().split(' ')[0]);
      if (srcsetArr.length > 0) s = srcsetArr[srcsetArr.length - 1];
    }
    
    // Check for data attributes commonly used for lazy loading high-res images
    const dataSrc = el.getAttribute('data-src') || el.getAttribute('data-original') || el.getAttribute('data-lazy-src') || el.getAttribute('data-zoom-target');
    if (dataSrc && dataSrc.startsWith('http')) s = dataSrc;

    if (!s || !s.startsWith('http') || s.includes('base64')) return;
    s = upgrade(s);
    if (allUrls.has(s)) return;
    allUrls.add(s);

    const w = el.naturalWidth || el.width;
    const h = el.naturalHeight || el.height;
    
    // Ignore very small images that are likely trackers or spacers
    if (w < 20 && h < 20) return;

    const alt = el.alt || el.title || '';
    const className = (el.className || '').toString().toLowerCase();
    const id = (el.id || '').toString().toLowerCase();
    const srcLower = s.toLowerCase();

    let type = 'OTHERS';
    
    // Logic for classification (Improved)
    if (className.includes('logo') || id.includes('logo') || srcLower.includes('logo') || alt.toLowerCase().includes('logo')) {
      type = 'LOGO';
    } else if (className.includes('banner') || id.includes('banner') || srcLower.includes('banner') || (w > 1000 && h < 600)) {
      type = 'BANNER';
    } else if (el.closest('[class*="product-single"], [class*="pdp"], [class*="product-main"], [id*="main-image"], [class*="gallery"]') || (w > 500 && h > 500)) {
      type = 'MAIN';
    } else if (w < 60 || h < 60) {
      type = 'ICONS';
    }

    imageList.push({ url: s, type, width: w, height: h, alt });
  });

  const metadata = {};
  try {
    metadata.t = document.querySelector('meta[property="og:title"]')?.content || document.title;
    metadata.p = document.querySelector('meta[property="og:price:amount"]')?.content || "";
    let d = "";
    
    // 1. Try common metadata first (most reliable generic way)
    const metaDesc = document.querySelector('meta[name="description"]')?.content || 
                     document.querySelector('meta[property="og:description"]')?.content || 
                     document.querySelector('meta[name="twitter:description"]')?.content;
    if (metaDesc) d = metaDesc;

    // 2. Try Schema.org itemprop (very common in e-commerce)
    if (!d) {
      const itempropDesc = document.querySelector('[itemprop="description"]');
      if (itempropDesc) d = itempropDesc.innerText || itempropDesc.getAttribute('content') || "";
    }

    // 3. Try common CSS selectors for Shopee, Amazon, Shopify, Lazada, etc.
    if (!d) {
      const selectors = [
        "#feature-bullets", // Amazon bullets
        "#productDescription", // Amazon description
        ".pdp-product-detail", // Generic/Lazada
        ".product-description", // Shopify/WooCommerce
        ".product__description",
        "div[data-automation='product-description']",
        ".description",
        "._2u0n77", // Shopee
        ".product-details__description"
      ];
      for (const s of selectors) {
        const e = document.querySelector(s);
        if (e && e.innerText.trim()) {
          d = e.innerText.trim();
          break;
        }
      }
    }
    
    metadata.d = d.trim().slice(0, 1000);
  } catch (e) {}

  return { images: imageList, metadata, url: window.location.href };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    sendResponse(extractImages());
  }
  return true;
});
