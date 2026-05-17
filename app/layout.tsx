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
