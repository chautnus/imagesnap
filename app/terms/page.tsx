import type { Metadata } from 'next';
import BackButton from '../privacy/BackButton';

export const metadata: Metadata = {
  title: "Terms of Service — ImageSnap",
  description: "Read ImageSnap's Terms of Service. By using ImageSnap you agree to these terms governing your use of our Chrome extension and web platform.",
  alternates: { canonical: "https://www.imagesnap.cloud/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service — ImageSnap",
    description: "Read ImageSnap's Terms of Service.",
    url: "https://www.imagesnap.cloud/terms",
    images: [{ url: "https://www.imagesnap.cloud/api/og?title=Terms+of+Service&category=homepage", width: 1200, height: 630 }],
  },
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-bg p-6 md:p-20 max-w-4xl mx-auto selection:bg-accent/30">
      <BackButton />

      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-muted mb-6">Last updated: June 11, 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
          <p className="text-muted leading-relaxed">
            By accessing or using ImageSnap Cloud (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service. These Terms apply to all users of the Service, including the Chrome extension and web platform at imagesnap.cloud.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">2. Description of Service</h2>
          <p className="text-muted leading-relaxed">
            ImageSnap is a Chrome extension and web platform that enables you to capture images and associated context from web pages and save them to your own Google Drive and Google Sheets. We provide the tooling; your data remains in your Google Workspace account at all times.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">3. Account Registration</h2>
          <p className="text-muted leading-relaxed">
            You must sign in with a valid Google account to use ImageSnap. You are responsible for maintaining the security of your account and for all activities that occur under your account. You must notify us immediately of any unauthorized use at <strong>support@imagesnap.cloud</strong>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">4. Subscription and Billing</h2>
          <p className="text-muted leading-relaxed mb-4">
            ImageSnap offers a free tier (30 captures/month) and a paid Solo Plan ($9.99/month or $99.90/year). By subscribing to a paid plan:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>You authorize us to charge your payment method on a recurring basis.</li>
            <li>Subscriptions renew automatically unless cancelled before the renewal date.</li>
            <li>You may cancel at any time through your account settings; access continues until the end of the billing period.</li>
            <li>Payments are processed by Lemon Squeezy. We do not store your payment card details.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">5. Refund Policy</h2>
          <p className="text-muted leading-relaxed">
            We offer a 7-day money-back guarantee on new paid subscriptions. If you are not satisfied within the first 7 days, contact us at <strong>support@imagesnap.cloud</strong> for a full refund. Refunds are not available after 7 days or for renewal charges.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">6. Acceptable Use</h2>
          <p className="text-muted leading-relaxed mb-4">
            You agree to use ImageSnap only for lawful purposes. You must not:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>Use the Service to scrape, harvest, or collect data in a manner that violates the terms of the websites you visit.</li>
            <li>Attempt to circumvent any rate limits, access controls, or technical restrictions.</li>
            <li>Use the Service to capture, store, or distribute illegal, harmful, or copyrighted content without authorization.</li>
            <li>Reverse-engineer, decompile, or attempt to extract source code from the Service.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">7. Intellectual Property</h2>
          <p className="text-muted leading-relaxed">
            The ImageSnap platform, brand, and software are owned by ImageSnap Cloud and protected by applicable intellectual property laws. You retain full ownership of all content and data you capture and store in your own Google Workspace. We claim no ownership over your research data.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">8. Disclaimer of Warranties</h2>
          <p className="text-muted leading-relaxed">
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components. Your use of the Service is at your own risk.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">9. Limitation of Liability</h2>
          <p className="text-muted leading-relaxed">
            To the maximum extent permitted by law, ImageSnap Cloud shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">10. Termination</h2>
          <p className="text-muted leading-relaxed">
            We reserve the right to suspend or terminate your account at our discretion if you violate these Terms. You may delete your account at any time through account settings. Upon termination, your data in Google Drive and Sheets remains accessible to you directly through Google.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">11. Changes to Terms</h2>
          <p className="text-muted leading-relaxed">
            We may update these Terms from time to time. We will notify you of material changes by email or by posting a notice in the app. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">12. Governing Law</h2>
          <p className="text-muted leading-relaxed">
            These Terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved through good-faith negotiation before resorting to formal legal proceedings.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">13. Contact Us</h2>
          <p className="text-muted leading-relaxed">
            If you have any questions about these Terms, please contact us at: <strong>support@imagesnap.cloud</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
