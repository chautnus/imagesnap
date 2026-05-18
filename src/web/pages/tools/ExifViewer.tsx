import React from 'react';
import { SEOPage } from '../SEOPage';

export const ExifViewer = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Free Online EXIF Viewer: Inspect Image Metadata — ImageSnap"
      description="View hidden EXIF metadata in any image. Inspect camera settings, GPS location, and timestamps for free — no upload required."
      headline={<>See everything <span className="text-accent italic">hidden in your photos.</span></>}
      subheadline="EXIF data tells you when a photo was taken, where, and with what settings. Most people never see it. ImageSnap surfaces it automatically on every capture."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">What is EXIF data?</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              Every digital photo contains hidden metadata — called EXIF (Exchangeable Image File Format) data — embedded by the camera or phone at the moment of capture. This includes the date and time the photo was taken, GPS coordinates, camera model, lens settings, and more.
            </p>
            <p className="text-muted text-lg mb-8 leading-relaxed font-medium">
              For professionals, EXIF data is evidence. It proves when a site photo was taken, verifies equipment used, and can confirm or dispute a location claim. For researchers and e-commerce teams, it helps track image provenance — whether a supplier photo is original or recycled from another source.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Date & Time", desc: "Exact timestamp down to the second — from the device clock at capture." },
                { label: "GPS Location", desc: "Latitude and longitude embedded by phones and GPS-enabled cameras." },
                { label: "Camera Settings", desc: "Make, model, aperture, shutter speed, ISO, focal length." },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                  <h3 className="font-bold text-accent">{item.label}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Common EXIF fields</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Field</th>
                    <th className="py-4 px-4 font-semibold text-muted">What it tells you</th>
                    <th className="py-4 px-4 font-semibold text-muted">Use case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ["DateTimeOriginal", "When the shutter was pressed", "Prove a site photo was taken on a specific date"],
                    ["GPSLatitude / GPSLongitude", "Where the photo was taken", "Verify a delivery or inspection location"],
                    ["Make / Model", "Camera manufacturer and model", "Verify equipment used for a shoot"],
                    ["ImageWidth / ImageHeight", "Pixel dimensions", "Check if an image meets resolution requirements"],
                    ["Software", "Editing software used", "Detect if an image was processed in Photoshop"],
                    ["Orientation", "Rotation flag", "Diagnose why an image appears rotated on upload"],
                  ].map(([field, meaning, use], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.01]'}>
                      <td className="py-3 px-4 font-mono text-accent text-xs">{field}</td>
                      <td className="py-3 px-4 text-muted">{meaning}</td>
                      <td className="py-3 px-4 text-muted">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">How ImageSnap uses EXIF data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-accent">Auto-populate metadata fields</h3>
                <p className="text-muted text-sm leading-relaxed">When you capture or upload a photo, ImageSnap reads the EXIF timestamp and embeds it in your Google Sheet log automatically. No manual date entry.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-accent">Build an auditable record</h3>
                <p className="text-muted text-sm leading-relaxed">For field inspections and construction documentation, the EXIF timestamp plus the ImageSnap capture log creates a two-layer proof of when and where a photo was taken.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-accent">Detect recycled supplier images</h3>
                <p className="text-muted text-sm leading-relaxed">If a supplier sends "new" product photos with EXIF dates from 3 years ago, or with GPS coordinates pointing to a different country — that's a red flag. ImageSnap surfaces it.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-accent">Organize by capture date</h3>
                <p className="text-muted text-sm leading-relaxed">ImageSnap can use the EXIF date to route photos into date-based subfolders automatically — useful for real estate and event photographers managing high shoot volumes.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
            <h2 className="text-3xl font-black mb-4">EXIF data and privacy</h2>
            <p className="text-muted leading-relaxed font-medium mb-4">
              When you share a photo publicly — on social media, a listing site, or via email — the EXIF data travels with it unless you strip it. GPS coordinates embedded in a photo taken at your home reveal your address to anyone who checks.
            </p>
            <p className="text-muted leading-relaxed font-medium">
              Most platforms (Instagram, Facebook, Twitter) strip EXIF on upload. Google Drive does not. If you&apos;re sharing Drive links publicly, be aware that recipients can inspect EXIF data in the original file.
            </p>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Does ImageSnap read EXIF from web-captured images?", a: "Web-captured images (screenshots or images captured from a website URL) typically don't retain the original camera EXIF data — that's embedded at camera capture time. However, ImageSnap logs its own capture timestamp, source URL, and user metadata for every capture." },
              { q: "Can I strip EXIF data before uploading to Drive?", a: "ImageSnap doesn't modify image files — it stores them as-is in your Google Drive. To strip EXIF before storage, pre-process images with a tool like ExifTool before uploading through ImageSnap." },
              { q: "What image formats support EXIF?", a: "EXIF is supported in JPEG, TIFF, and most RAW formats (CR2, NEF, ARW). PNG files can contain some metadata in XMP format but not full EXIF. WebP has limited metadata support depending on the encoder." },
              { q: "Can I search my Google Sheet by EXIF date?", a: "Yes. The capture timestamp logged in your ImageSnap Sheet is a date column — you can filter, sort, or build formulas against it like any other Sheets column." },
            ].map((item, i) => (
              <details key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 group">
                <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                  {item.q}
                  <span className="transition group-open:rotate-180">▾</span>
                </summary>
                <p className="text-muted mt-4 leading-relaxed font-medium">{item.a}</p>
              </details>
            ))}
          </section>

        </div>
      }
    />
  );
};
