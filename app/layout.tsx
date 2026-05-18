import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "../src/web/index.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D4FF00",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.imagesnap.cloud"),
  title: "ImageSnap | Save Images with Context to Google Drive & Sheets",
  description: "Capture any image from the web with custom context fields. Auto-save to Google Drive, log details to Google Sheets. Free plan: 30 captures/month.",
  keywords: ["image context", "google drive photos", "google sheets research", "product research tool", "image metadata capture", "visual database"],
  openGraph: {
    type: "website",
    title: "ImageSnap | Save Images with Context to Google Drive & Sheets",
    description: "Capture any image from the web with custom context fields. Auto-save to Google Drive, log details to Google Sheets.",
    images: [{ url: "https://www.imagesnap.cloud/og-image.png" }],
    url: "https://www.imagesnap.cloud/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageSnap | Save Images with Context to Google Drive & Sheets",
    description: "Capture any image from the web with custom context fields. Auto-save to Google Drive, log details to Google Sheets.",
    images: ["https://www.imagesnap.cloud/og-image.png"],
  },
  alternates: {
    canonical: "https://www.imagesnap.cloud/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon192.png",
    apple: "/icon512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          window._debugLogs = [];
          window._pushDebug = function(msg) {
            var log = '[' + new Date().toISOString().split('T')[1].split('Z')[0] + '] ' + msg;
            window._debugLogs.push(log);
            console.log(log);
            try {
              var buffer = JSON.parse(localStorage.getItem('imagesnap_log_buffer') || '[]');
              buffer.push(log);
              localStorage.setItem('imagesnap_log_buffer', JSON.stringify(buffer));
            } catch(e) {}
            window.dispatchEvent(new CustomEvent('SYS_DEBUG_UPDATE'));
          };
          window.onerror = function(msg, url, line, col, error) {
            window._pushDebug('[FATAL_ERROR] ' + msg + ' (' + url + ':' + line + ')');
          };
          window.onunhandledrejection = function(event) {
            window._pushDebug('[UNHANDLED_PROMISE] ' + (event.reason ? event.reason.message || event.reason : 'Unknown'));
          };
          window._pushDebug('[KERNEL] Diagnostic Layer Initialized');

          if (typeof document !== 'undefined') {
            var initConsole = function() {
              if (document.getElementById('debug-badge')) return;
              
              // Floating Badge
              var badge = document.createElement('div');
              badge.id = 'debug-badge';
              badge.style.cssText = 'position:fixed;bottom:80px;left:16px;z-index:9999999;background:#FF4B4B;color:white;font-family:sans-serif;font-size:9px;font-weight:bold;padding:6px 10px;border-radius:20px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.5);display:flex;align-items:center;gap:4px;user-select:none;letter-spacing:0.05em;';
              badge.innerHTML = '<span>🐛</span><span>LOGS</span>';
              document.body.appendChild(badge);

              // Console Panel
              var panel = document.createElement('div');
              panel.id = 'debug-panel';
              panel.style.cssText = 'position:fixed;bottom:120px;left:16px;right:16px;z-index:9999998;background:rgba(10,10,10,0.95);border:2px solid rgba(212,255,0,0.2);border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.9);backdrop-filter:blur(10px);font-family:monospace;padding:12px;display:none;flex-direction:column;max-height:45vh;overflow:hidden;box-sizing:border-box;';
              panel.innerHTML = 
                '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:6px;margin-bottom:8px;user-select:none;">' +
                  '<span style="color:#D4FF00;font-size:9px;font-weight:bold;letter-spacing:0.1em;">LIVE MOBILE DIAGNOSTICS</span>' +
                  '<div style="display:flex;gap:12px;">' +
                    '<span id="debug-copy" style="color:rgba(255,255,255,0.5);font-size:8px;cursor:pointer;font-weight:bold;">[COPY]</span>' +
                    '<span id="debug-unreg" style="color:#FF4B4B;font-size:8px;cursor:pointer;font-weight:bold;">[UNREG SW]</span>' +
                    '<span id="debug-close" style="color:rgba(255,255,255,0.5);font-size:8px;cursor:pointer;font-weight:bold;">[CLOSE]</span>' +
                  '</div>' +
                '</div>' +
                '<div id="debug-log-list" style="flex:1;overflow-y:auto;font-size:8px;line-height:1.4;display:flex;flex-direction:column;gap:4px;color:rgba(255,255,255,0.8);max-height:35vh;"></div>';
              document.body.appendChild(panel);

              badge.addEventListener('click', function() {
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
              });

              document.getElementById('debug-close').addEventListener('click', function() {
                panel.style.display = 'none';
              });

              document.getElementById('debug-copy').addEventListener('click', function() {
                var text = window._debugLogs.join("\\n");
                navigator.clipboard.writeText(text).then(function() {
                  alert('Logs copied to clipboard!');
                }).catch(function() {
                  alert('Copy failed: Use remote debugging or select text manually.');
                });
              });

              document.getElementById('debug-unreg').addEventListener('click', function() {
                if (confirm('Unregister all service workers and reload? This clears cache issues.')) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    var promises = regs.map(function(r) { return r.unregister(); });
                    Promise.all(promises).then(function() {
                      window.location.reload();
                    });
                  });
                }
              });

              function renderLogs() {
                var list = document.getElementById('debug-log-list');
                if (!list) return;
                list.innerHTML = '';
                window._debugLogs.forEach(function(log) {
                  var el = document.createElement('div');
                  el.style.wordBreak = 'break-all';
                  el.style.borderBottom = '1px solid rgba(255,255,255,0.02)';
                  el.style.paddingBottom = '2px';
                  if (log.indexOf('FATAL') !== -1 || log.indexOf('FAIL') !== -1 || log.indexOf('ERR') !== -1) {
                    el.style.color = '#FF4B4B';
                    el.style.fontWeight = 'bold';
                  } else if (log.indexOf('[SW]') !== -1) {
                    el.style.color = '#00A3FF';
                  } else if (log.indexOf('[KERNEL]') !== -1 || log.indexOf('[STAGE]') !== -1 || log.indexOf('SUCCESS') !== -1) {
                    el.style.color = '#D4FF00';
                  }
                  el.textContent = log;
                  list.appendChild(el);
                });
                list.scrollTop = list.scrollHeight;
              }

              window.addEventListener('SYS_DEBUG_UPDATE', renderLogs);
              renderLogs();

              // Listen to Service Worker message broadcast
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.addEventListener('message', function(event) {
                  if (event.data && event.data.type === 'SW_DEBUG_LOG') {
                    window._pushDebug('[SW] ' + event.data.msg);
                  }
                });
              }
            };

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initConsole);
            } else {
              initConsole();
            }
          }
        `}} />
      </head>
      <body className="antialiased">
        {children}
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XC45ZRJ7Y9" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XC45ZRJ7Y9');
          `}
        </Script>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('SW registered:', registration.scope);
              }).catch(function(err) {
                console.error('SW registration failed:', err);
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
