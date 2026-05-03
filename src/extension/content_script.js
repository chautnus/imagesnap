
function upgrade(u) {
  if (!u) return u;
  
  // Shopee
  if (u.includes('down-cv.img.susercontent.com') || u.includes('down-vn.img.susercontent.com') || u.includes('down-bs.img.susercontent.com') || u.includes('down-tx.img.susercontent.com')) {
    if (u.includes('@resize')) return u.replace(/@resize_w\d+.*$/, '@resize_w800_nl'); 
    // Aggressively remove _tn, _zoom, or _WxH even if followed by extension
    return u.replace(/_(tn|zoom)(?:\.[a-zA-Z]+)?$/i, '').replace(/_(\d+)x(\d+)(?:\.[a-zA-Z]+)?$/i, '');
  }
  
  // AliExpress / Alibaba / Lazada
  if (u.includes('alicdn.com') || u.includes('lazcdn.com')) {
    // Matches _120x120.jpg_.webp, _50x50.jpg, etc.
    return u.replace(/_\d+x\d+[^/]*$/i, '');
  }

  // Etsy
  if (u.includes('etsystatic.com')) {
    return u.replace(/\/il_\d+x\d+\./i, '/il_fullxfull.');
  }

  // Generic thumbnail replacements
  return u.replace(/\/(thumb|thumbnail|small|sq|mini|50x50|72x72|100x100|150x150|200x200)\//i, '/original/')
          .replace(/-(thumb|thumbnail|small|sq|mini|50x50|72x72|100x100|150x150|200x200)(\.[a-zA-Z]+)$/i, '$2');
}

function extractJsonLd() {
  let result = { d: "", p: "" };
  try {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      if (!script.innerText) continue;
      
      let data;
      try {
        data = JSON.parse(script.innerText);
      } catch (e) {
        continue;
      }

      const items = Array.isArray(data) ? data : [data];
      
      for (const item of items) {
        if (item['@type'] === 'Product' || (Array.isArray(item['@type']) && item['@type'].includes('Product'))) {
          if (item.description && !result.d) {
            result.d = item.description;
          }
          
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offers.price && !result.p) {
              result.p = `${offers.priceCurrency || ''} ${offers.price}`.trim();
            } else if (offers.lowPrice && offers.highPrice && !result.p) {
              result.p = `${offers.priceCurrency || ''} ${offers.lowPrice} - ${offers.highPrice}`.trim();
            } else if (offers.lowPrice && !result.p) {
              result.p = `${offers.priceCurrency || ''} ${offers.lowPrice}`.trim();
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error parsing JSON-LD:", e);
  }
  return result;
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
    
    // 1. Prioritize JSON-LD
    const jsonLdData = extractJsonLd();
    let p = jsonLdData.p;
    let d = jsonLdData.d;

    // 2. Fallback for Price
    if (!p) {
      const priceSelectors = [
        'meta[property="og:price:amount"]',
        'meta[property="product:price:amount"]',
        '[itemprop="price"]',
        '.pqTWkA', // Shopee main price
        '.Y3DvsN', // Shopee variant
        '.M-Dd8u', // Shopee variant
        '[data-buy-box-region="price"] p', // Etsy
        'p.wt-text-title-03.wt-mr-xs-1', // Etsy fallback
        '.pdp-price_type_normal', // Lazada
        '.price',
        '.product-price'
      ];
      for (const sel of priceSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          p = el.getAttribute('content') || el.innerText || "";
          if (p.trim()) {
            p = p.trim();
            break;
          }
        }
      }
      
      // Aggressive fallback for Shopee/Etsy: scan DOM for standalone price text nodes
      if (!p) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
          const text = node.nodeValue?.trim() || "";
          // Match exact price formats like "₫150.000", "$15.99", "₫150.000 - ₫200.000", "150.000 ₫"
          if (text.match(/^([₫$]\s*[\d.,]+(\s*-\s*[₫$]?\s*[\d.,]+)?|[\d.,]+\s*[₫$])$/)) {
            // Verify it's not inside a hidden container or script
            const parent = node.parentElement;
            if (parent && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE' && parent.offsetHeight > 0) {
              p = text;
              break;
            }
          }
        }
      }
    }
    metadata.p = p;
    
    // 3. Fallback for Description
    // Amazon often puts "About this item" in #feature-bullets. 
    // JSON-LD might contain a very short generic string, so we override it if the DOM has rich bullets.
    const amazonBullets = document.querySelector('#feature-bullets ul');
    if (amazonBullets && amazonBullets.innerText.trim().length > (d ? d.length : 0)) {
      d = amazonBullets.innerText.trim();
    }

    if (!d || d.length < 50) {
      const metaDesc = document.querySelector('meta[name="description"]')?.content || 
                       document.querySelector('meta[property="og:description"]')?.content || 
                       document.querySelector('meta[name="twitter:description"]')?.content;
      if (metaDesc && metaDesc.length > (d ? d.length : 0)) d = metaDesc;
    }

    if (!d) {
      const itempropDesc = document.querySelector('[itemprop="description"]');
      if (itempropDesc) d = itempropDesc.innerText || itempropDesc.getAttribute('content') || "";
    }

    if (!d) {
      const selectors = [
        "#feature-bullets", 
        "#productDescription", 
        ".pdp-product-detail", 
        ".product-description", 
        ".product__description",
        "div[data-automation='product-description']",
        ".description",
        "._2u0n77", 
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
  } catch (e) {
    console.error("Error extracting metadata:", e);
  }

  return { images: imageList, metadata, url: window.location.href };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    sendResponse(extractImages());
  }
  return true;
});
