(function() {
  console.log('ProductSnap Content Script Loaded');

  const origin = window.location.origin;
  // We need to know where the main app is hosted to redirect for import.
  // For the extension, we'll store this in chrome.storage or use a default.
  // For now, let's try to detect it or use the placeholder.
  const APP_URL = 'https://' + window.location.hostname; // This is a placeholder, usually it would be the shared URL

  function upgrade(u: string) {
    if (!u) return u;
    if (u.includes('down-cv.img.susercontent.com') || u.includes('down-vn.img.susercontent.com')) {
      if (u.includes('@resize')) {
        return u.replace(/@resize_w\d+.*$/, '@resize_w800_nl'); 
      }
      return u.replace(/_tn$/, '').replace(/_zoom$/, '').replace(/_(\d+)x(\d+)$/, '');
    }
    if (u.includes('alicdn.com')) {
      return u.replace(/_\d+x\d+.*\.jpg$/, '').replace(/_\d+x\d+.*\.png$/, '');
    }
    return u.replace(/\/(thumb|thumbnail|small|sq|mini)\//i, '/original/');
  }

  function collectImages() {
    const imgs: string[] = [];
    document.querySelectorAll('img').forEach((el: any) => {
      let s = el.currentSrc || el.src;
      if (!s || !s.startsWith('http')) return;
      
      if (el.srcset) {
        const sets = el.srcset.split(',').map((v: string) => v.trim().split(' '));
        sets.sort((a: any, b: any) => parseInt(b[1]||0) - parseInt(a[1]||0));
        if (sets[0] && sets[0][0]) s = sets[0][0];
      }
      
      s = upgrade(s);
      if(el.naturalWidth > 60 && el.naturalHeight > 60 && !imgs.includes(s)) imgs.push(s);
    });
    return imgs;
  }

  function showOverlay(imgs: string[]) {
    if(!imgs.length){alert('No product images found!');return;}
    
    const sel = new Set<number>();
    const ov = document.createElement('div');
    ov.id = '__ps_extension_ov';
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;font-family:sans-serif;backdrop-filter:blur(4px);';
    document.body.appendChild(ov);

    function render() {
      let h = '<div style="all:initial;display:flex;flex-direction:column;background:#111;border:2px solid #D4FF00;border-radius:20px;padding:24px;max-width:440px;width:90%;max-height:85vh;color:#fff;box-shadow:0 30px 60px rgba(0,0,0,0.8);box-sizing:border-box;font-family:sans-serif;">';
      h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;box-sizing:border-box;"><strong style="font-size:18px;letter-spacing:-0.02em;color:#fff;font-family:sans-serif;">📦 PS_COLLECTOR v4</strong><button id="__ps_x" style="background:#222;border:none;color:#fff;font-size:24px;cursor:pointer;line-height:1;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">&times;</button></div>';
      h += '<div id="__ps_g" style="display:grid;grid-template-columns:repeat(5,1fr);row-gap:20px;column-gap:12px;margin-bottom:24px;overflow-y:auto;padding:4px;box-sizing:border-box;min-height:100px;max-height:50vh;scrollbar-width:none;">';
      
      imgs.forEach((src, i) => {
        const isS = sel.has(i);
        h += '<div data-i="'+i+'" style="cursor:pointer;border-radius:8px;overflow:hidden;background:#222;border:2px solid '+(isS?'#D4FF00':'transparent')+';position:relative;padding:0;transition:all 0.1s;box-sizing:border-box;display:block;margin:0;width:100%;">';
        h += '<div style="padding-bottom:100%;height:0;position:relative;width:100%;box-sizing:border-box;">';
        h += '<div style="position:absolute;inset:0;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">';
        h += '<img src="'+src.replace(/"/g,'%22')+'" style="display:block;width:100%;height:100%;object-fit:cover;opacity:'+(isS?'1':'0.7')+';transition:opacity 0.2s;pointer-events:none;box-sizing:border-box;">';
        h += '</div></div>';
        if(isS) h += '<div style="position:absolute;top:4px;right:4px;background:#D4FF00;color:#000;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:8px;box-shadow:0 2px 4px rgba(0,0,0,0.5);border:1.5px solid #000;box-sizing:border-box;z-index:2;">✓</div>';
        h += '</div>';
      });

      h += '</div><div style="display:flex;gap:12px;box-sizing:border-box;">';
      h += '<button id="__ps_ok" style="flex:1;padding:14px;background:#D4FF00;color:#000;border:none;border-radius:14px;cursor:pointer;font-weight:900;text-transform:uppercase;font-size:13px;letter-spacing:0.05em;box-shadow:0 4px 15px rgba(212,255,0,0.3);box-sizing:border-box;">✓ IMPORT ('+sel.size+')</button>';
      h += '<button id="__ps_c" style="padding:14px;background:#222;color:#fff;border:none;border-radius:14px;cursor:pointer;font-weight:bold;font-size:12px;box-sizing:border-box;">Cancel</button></div></div>';
      
      ov.innerHTML = h;

      ov.querySelectorAll("[data-i]").forEach((el: any) => {
        el.onclick = () => {
          const i = parseInt(el.getAttribute("data-i"));
          if(sel.has(i)) sel.delete(i); else sel.add(i);
          render();
        }
      });

      const close = () => ov.remove();
      const xBtn = document.getElementById("__ps_x");
      const cBtn = document.getElementById("__ps_c");
      if (xBtn) xBtn.onclick = close;
      if (cBtn) cBtn.onclick = close;

      const okBtn = document.getElementById("__ps_ok");
      if (okBtn) {
        okBtn.onclick = () => {
          if(!sel.size){alert("Please select at least 1 image");return;}
          const selected: string[] = [];
          sel.forEach(i => selected.push(imgs[i]));
          
          const meta: any = {};
          try {
            meta.t = (document.querySelector('meta[property="og:title"]') as any)?.content || document.title;
            meta.p = (document.querySelector('meta[property="og:price:amount"]') as any)?.content || "";
            let d = "";
            [".pdp-product-detail", "._2u0n77", ".product-details__description", "#product-description"].forEach(s => {
              const e = document.querySelector(s) as HTMLElement;
              if (e && !d) d = e.innerText;
            });
            if (!d) d = (document.querySelector('meta[property="og:description"]') as any)?.content || "";
            meta.d = d.slice(0, 1000); // Limit size
          } catch (e) {}

          // Request target App URL from extension background
          // @ts-ignore
          chrome.runtime.sendMessage({ type: 'GET_APP_URL' }, (response: any) => {
            const baseUrl = response?.url || 'https://ais-pre-litx3qlsepsiwqgx5n3vmu-658490117315.us-east1.run.app'; // Fallback to current share URL
            const u = baseUrl + (baseUrl.endsWith("/")?"":"/") + "#import=" + encodeURIComponent(selected.join(",")) + "&url=" + encodeURIComponent(window.location.href) + "&metadata=" + encodeURIComponent(JSON.stringify(meta));
            window.open(u, "_blank");
            ov.remove();
          });
        };
      }
    }
    render();
  }

  // Inject Floating Snap Button
  const snapBtn = document.createElement('div');
  snapBtn.id = '__ps_snap_trigger';
  snapBtn.innerHTML = '📦 SNAP';
  snapBtn.style.cssText = 'position:fixed;right:20px;bottom:100px;z-index:2147483646;background:#D4FF00;color:#000;padding:12px 20px;border-radius:50px;font-weight:900;font-size:14px;cursor:pointer;box-shadow:0 10px 30px rgba(212,255,0,0.4);border:3px solid #000;transition:all 0.2s;user-select:none;font-family:sans-serif;';
  
  snapBtn.onmouseenter = () => { snapBtn.style.transform = 'scale(1.1) rotate(-3deg)'; snapBtn.style.background = '#fff'; };
  snapBtn.onmouseleave = () => { snapBtn.style.transform = 'scale(1) rotate(0deg)'; snapBtn.style.background = '#D4FF00'; };
  
  snapBtn.onclick = () => {
    const images = collectImages();
    showOverlay(images);
  };

  document.body.appendChild(snapBtn);

})();
