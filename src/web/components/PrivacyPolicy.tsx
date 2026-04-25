import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-bg p-6 md:p-20 max-w-4xl mx-auto selection:bg-accent/30">
      <button 
        onClick={onBack}
        className="mb-12 flex items-center gap-2 text-muted hover:text-accent transition-colors"
      >
        <ArrowLeft size={16} /> BACK TO HOME
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-invert max-w-none"
      >
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-muted mb-6">Last updated: April 23, 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
          <p className="text-muted leading-relaxed">
            Welcome to ImageSnap Cloud ("we", "our", or "us"). We are committed to protecting your privacy and ensuring transparency in how we handle your data. Our service is designed to help you collect e-commerce content and images to your personal Google Cloud account.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">2. Data We Collect</h2>
          <p className="text-muted leading-relaxed mb-4">
            ImageSnap is a privacy-first tool. We only access the data necessary to provide our service:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li><strong>Google Profile Info:</strong> We access your email and name via Google Login to identify your personal Workspace.</li>
            <li><strong>Images & Metadata:</strong> When you use our extension, we extract URLs and text from websites you specify.</li>
            <li><strong>Google API Scopes:</strong> We require permission to read/write to specific Google Sheets and Google Drive folders that YOU approve.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">3. How We Store Data</h2>
          <p className="text-muted leading-relaxed">
            <strong>We do not store your collected images or product data on our servers.</strong> All images and metadata are sent directly from your browser to YOUR Google Drive and Google Sheets. We only maintain a record of your subscription status and basic account metadata (like usage counts) in our secure Firestore database.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">4. Third-Party Services</h2>
          <p className="text-muted leading-relaxed mb-4">
            We use a strictly limited number of third-party processors:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li><strong>Google:</strong> For Authentication, Sheets, and Drive integration.</li>
            <li><strong>Firebase:</strong> For storing account settings and billing status.</li>
            <li><strong>Lemon Squeezy:</strong> For secure payment processing. We never see your credit card details.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">5. Your Rights</h2>
          <p className="text-muted leading-relaxed">
            You have the right to access, export, or delete your account data at any time through our settings interface. Since your primary data is stored in Google Workspace, you retain full ownership and control over it.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">6. Contact Us</h2>
          <p className="text-muted leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at: <strong>loch7444@gmail.com</strong>
          </p>
        </section>
      </motion.div>
    </div>
  );
};
