import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "@web/index.css";

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
  title: "ImageSnap | Auto-organize team photos in Google Drive",
  description: "Save images from the web directly to Google Drive, auto-classify into folders, and attach detailed metadata.",
  keywords: ["dropshipping", "product research", "google sheets", "ecommerce tool", "image scraper", "shopify collector"],
  openGraph: {
    type: "website",
    title: "ImageSnap | Ecommerce Image & Data Collector",
    description: "Snap product images and details directly to Google Sheets from any website.",
    images: ["/og-image.png"],
    url: "https://www.imagesnap.cloud/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageSnap | Ecommerce Image & Data Collector",
    description: "Collect product images and metadata from any ecommerce site directly to Google Sheets.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.imagesnap.cloud/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">
        {children}
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      </body>
    </html>
  );
}
