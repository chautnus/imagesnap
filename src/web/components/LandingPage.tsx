import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'motion/react';
import { Chrome, Zap, X } from 'lucide-react';

export const LandingPage = ({ onLogin, t, variant = 0 }: { onLogin: () => void, t: any, variant?: number }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginOptions(true);
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ImageSnap",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://imagesnap.cloud",
    "description": "Save any image with your designed context. Images in Google Drive, context in Google Sheets. Research once, use forever.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "One-click capture: images + designed context from any page",
      "Product images saved to Google Drive",
      "Designed context fields in Google Sheets",
      "Unlimited custom fields per category",
      "Team collaboration",
      "Data ownership — your Drive, your Sheet"
    ]
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ImageSnap",
    "url": "https://imagesnap.cloud",
    "description": "Save any image with your designed context. Research once, use forever."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does ImageSnap actually do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When you browse a product page, you click the extension. ImageSnap saves the images to your Google Drive and captures the context — title, price, description, source — into your Google Sheet. You can also add your own custom fields to match your workflow."
        }
      },
      {
        "@type": "Question",
        "name": "What is \"designed context\"?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It means you decide what information gets attached to each image. ImageSnap auto-fills what it can from the page, but you can add any custom fields — project name, rating, supplier, status, notes — whatever makes the image useful for your work."
        }
      },
      {
        "@type": "Question",
        "name": "How is this different from just saving screenshots?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Screenshots sit in a folder with no context. A month later, you can't remember the price, the source, or why you saved it. ImageSnap attaches context to every image so it stays useful."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Images go to your Google Drive. Context goes to your Google Sheet. We don't store your research data on our servers."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if I cancel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Everything stays. Your Drive images and Sheet records are yours. ImageSnap simply stops adding new captures."
        }
      },
      {
        "@type": "Question",
        "name": "Is this a scraper?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. ImageSnap works inside your browser while you browse normally. You choose what to capture. It's human-guided, not automated."
        }
      }
    ]
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Login Options Modal */}
      <AnimatePresence>
        {showLoginOptions && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginOptions(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowLoginOptions(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
              </div>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome to ImageSnap</h2>
                <p className="text-gray-500 font-medium text-sm">Choose your login type to continue</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => { setShowLoginOptions(false); onLogin(); }}
                  className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Chrome size={24} className="text-gray-700 group-hover:text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">ADMIN_ACCESS</div>
                    <div className="text-[10px] text-gray-500 font-bold">Log in with Google</div>
                  </div>
                </button>

                <button 
                  onClick={() => { setShowLoginOptions(false); window.location.hash = '#staff'; }}
                  className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Zap size={24} className="text-gray-700 group-hover:text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">STAFF_ACCESS</div>
                    <div className="text-[10px] text-gray-500 font-bold">Username / Password</div>
                  </div>
                </button>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-[11px] text-center text-gray-500 font-medium">
                Note: Staff accounts must be created by an Admin in the Settings tab.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
              <a href="/" className="text-xl font-extrabold tracking-tight text-gray-900">Image<span className="text-blue-600">Snap</span></a>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                  <a href="#how-it-works" className="hover:text-gray-900 transition">How it works</a>
                  <a href="#comparison" className="hover:text-gray-900 transition">Compare</a>
                  <a href="#use-cases" className="hover:text-gray-900 transition">Use cases</a>
                  <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
                  <a href="#faq" className="hover:text-gray-900 transition">FAQ</a>
              </div>
              <div className="flex items-center gap-3">
                  <a href="#" onClick={handleLoginClick} className="hidden sm:inline-block text-sm font-medium text-gray-600 hover:text-gray-900 transition">Log in</a>
                  <a href="#" onClick={handleLoginClick} className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Try free</a>
              </div>
          </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Your pictures are worthless without context.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              ImageSnap captures any image with your designed context — the fields you choose, the categories you define, the details that make each picture useful forever. One capture, use it in any later work.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <a href="#" onClick={handleLoginClick} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Try free — 30 captures/month</a>
              <a href="#how-it-works" className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">See how it works ↓</a>
          </div>
          <div className="bg-gray-200 border border-gray-300 rounded-xl aspect-video max-w-4xl mx-auto flex items-center justify-center overflow-hidden relative">
              <img src="/imagesnap_extension_form_preview.png" alt="ImageSnap Preview" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent flex items-end justify-center pb-6 opacity-0 hover:opacity-100 transition-opacity">
                 <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">ImageSnap Context Form</span>
              </div>
          </div>
      </header>

      {/* PROBLEM SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Sound familiar?</h2>
          <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-gray-700 text-lg italic">"I saved 200 product screenshots but can't remember why I saved half of them."</p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                  <div className="text-4xl mb-4">🗂️</div>
                  <p className="text-gray-700 text-lg italic">"My research folder is full of images with no price, no source, no notes. Just dead files."</p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-700 text-lg italic">"I did great research last month. Now I need it again and can't find anything useful."</p>
              </div>
          </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-white py-20 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Save the image. Keep the meaning.</h2>
              <div className="grid md:grid-cols-3 gap-12">
                  <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <span className="text-2xl">📸</span>
                      </div>
                      <h3 className="text-xl font-bold mb-4">Capture any image with context</h3>
                      <p className="text-gray-600">Click the extension on any supported page. ImageSnap saves the image to your Google Drive and captures the context around it — title, price, description, source URL. Auto-filled when possible, customizable always.</p>
                  </div>
                  <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <span className="text-2xl">🏷️</span>
                      </div>
                      <h3 className="text-xl font-bold mb-4">You design the context</h3>
                      <p className="text-gray-600">Add any fields your workflow needs: supplier name, rating, project code, season, status — whatever matters to you. Every category can have its own schema. Your context, your rules.</p>
                  </div>
                  <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <span className="text-2xl">♾️</span>
                      </div>
                      <h3 className="text-xl font-bold mb-4">Spend one time, use forever</h3>
                      <p className="text-gray-600">Six months from now, find that image and know exactly why you saved it, where it came from, and what it means. Images live in your Google Drive. Context lives in your Google Sheet. Both stay yours forever.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16">Three steps. No setup required.</h2>
          <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                  <h3 className="text-xl font-bold mb-3">Design your context</h3>
                  <p className="text-gray-600">Define the fields that matter for your research — or use defaults. Each category can have its own schema.</p>
              </div>
              <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                  <h3 className="text-xl font-bold mb-3">Browse and capture</h3>
                  <p className="text-gray-600">Click the extension on any image worth saving. Context fills automatically. Choose what matters, skip the rest.</p>
              </div>
              <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                  <h3 className="text-xl font-bold mb-3">Search and reuse</h3>
                  <p className="text-gray-600">Find any image by its context in the web app, or open your Google Sheet directly. Your research, ready for any later work.</p>
              </div>
          </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className="bg-blue-50 border-y border-blue-100 py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
              <p className="text-xl font-semibold text-gray-800 mb-4">Research once. Use it in any later work.</p>
              <a href="#" onClick={handleLoginClick} className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Try free — 30 captures/month</a>
          </div>
      </section>

      {/* HOW IT'S DIFFERENT */}
      <section id="comparison" className="bg-gray-900 text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Not a scraper. Not a bookmark. Images with meaning.</h2>
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-gray-700">
                              <th className="py-4 px-4 font-semibold text-gray-400"></th>
                              <th className="py-4 px-4 font-semibold">Screenshot folder</th>
                              <th className="py-4 px-4 font-semibold">DIY scraper</th>
                              <th className="py-4 px-4 font-semibold text-blue-400">ImageSnap</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                          <tr>
                              <td className="py-4 px-4 font-medium">Images saved</td>
                              <td className="py-4 px-4">Yes, but no context</td>
                              <td className="py-4 px-4">Bulk, no curation</td>
                              <td className="py-4 px-4 text-blue-300 font-medium">Yes, with your context</td>
                          </tr>
                          <tr>
                              <td className="py-4 px-4 font-medium">Context attached</td>
                              <td className="py-4 px-4">None</td>
                              <td className="py-4 px-4">Fixed schema only</td>
                              <td className="py-4 px-4 text-blue-300 font-medium">Your designed context</td>
                          </tr>
                          <tr>
                              <td className="py-4 px-4 font-medium">Findable later</td>
                              <td className="py-4 px-4">Hard</td>
                              <td className="py-4 px-4">Requires DB query</td>
                              <td className="py-4 px-4 text-blue-300 font-medium">Search by any field</td>
                          </tr>
                          <tr>
                              <td className="py-4 px-4 font-medium">Maintenance</td>
                              <td className="py-4 px-4">None</td>
                              <td className="py-4 px-4">Ongoing</td>
                              <td className="py-4 px-4 text-blue-300 font-medium">Low</td>
                          </tr>
                          <tr>
                              <td className="py-4 px-4 font-medium">Policy risk</td>
                              <td className="py-4 px-4">None</td>
                              <td className="py-4 px-4">High</td>
                              <td className="py-4 px-4 text-blue-300 font-medium">Lower</td>
                          </tr>
                          <tr>
                              <td className="py-4 px-4 font-medium">Data ownership</td>
                              <td className="py-4 px-4">Yours (unstructured)</td>
                              <td className="py-4 px-4">Yours (custom DB)</td>
                              <td className="py-4 px-4 text-blue-300 font-medium">Yours (Drive + Sheet)</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16">Every image tells a story. ImageSnap remembers it.</h2>
          <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-3">Competitor tracking</h3>
                  <p className="text-gray-600">Save competitor product images with price, positioning and source. Build a visual database that shows how competitors change over time.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-3">Market research</h3>
                  <p className="text-gray-600">Capture product trends with images and context. Review visually, compare by fields, share with your team.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-3">Sourcing and procurement</h3>
                  <p className="text-gray-600">Save supplier products with photos, specs and pricing. Compare visually across sources — no more juggling tabs and screenshots.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-3">Personal knowledge base</h3>
                  <p className="text-gray-600">Save anything visual from the web with the context that makes it findable later. Recipes, designs, references, inspiration — with your own fields attached.</p>
              </div>
          </div>
      </section>

      {/* CTA after use cases */}
      <section className="bg-blue-50 border-y border-blue-100 py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
              <p className="text-xl font-semibold text-gray-800 mb-2">Stop losing your valuable research.</p>
              <p className="text-gray-600 mb-6">30 captures/month free. No credit card required.</p>
              <a href="#" onClick={handleLoginClick} className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Start capturing with context</a>
          </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-gray-100 py-20">
          <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">Start free. Pay when your research grows.</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold mb-2">Free</h3>
                      <div className="text-3xl font-extrabold mb-6">$0<span className="text-base font-normal text-gray-500">/month</span></div>
                      <ul className="space-y-3 text-gray-600 mb-8">
                          <li>• 30 captures/month</li>
                          <li>• 1 user</li>
                          <li>• 3 categories</li>
                          <li>• See if it fits your workflow</li>
                      </ul>
                      <a href="#" onClick={handleLoginClick} className="block w-full text-center bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200">Start Free</a>
                  </div>
                  <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg border border-blue-700 transform scale-105">
                      <h3 className="text-xl font-bold mb-2">Solo</h3>
                      <div className="text-3xl font-extrabold mb-6">$19<span className="text-base font-normal text-blue-200">/month</span></div>
                      <ul className="space-y-3 mb-8">
                          <li>• Unlimited captures</li>
                          <li>• 1 user</li>
                          <li>• Unlimited categories</li>
                          <li>• For serious researchers</li>
                      </ul>
                      <a href="#" onClick={handleLoginClick} className="block w-full text-center bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-50">Get Solo</a>
                  </div>
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold mb-2">Team</h3>
                      <div className="text-3xl font-extrabold mb-6">$49<span className="text-base font-normal text-gray-500">/month</span></div>
                      <ul className="space-y-3 text-gray-600 mb-8">
                          <li>• Unlimited captures</li>
                          <li>• 3 users</li>
                          <li>• Unlimited categories</li>
                          <li>• Priority support</li>
                      </ul>
                      <a href="#" onClick={handleLoginClick} className="block w-full text-center bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200">Get Team</a>
                  </div>
              </div>
          </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-4">
              {faqSchema.mainEntity.map((q, i) => (
                  <details key={i} className="bg-white border border-gray-200 rounded-lg p-4 group">
                      <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                          {q.name}
                          <span className="transition group-open:rotate-180">▾</span>
                      </summary>
                      <p className="text-gray-600 mt-4 leading-relaxed">{q.acceptedAnswer.text}</p>
                  </details>
              ))}
          </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                  <a href="#" className="hover:text-white transition">Blog</a>
                  <a href="#pricing" className="hover:text-white transition">Pricing</a>
                  <a href="#how-it-works" className="hover:text-white transition">How it works</a>
                  <a href="#" className="hover:text-white transition">About</a>
                  <a href="#" className="hover:text-white transition">Help</a>
                  <a href="#" className="hover:text-white transition">Contact</a>
                  <a href="/privacy" className="hover:text-white transition">Privacy</a>
              </div>
              <div className="flex justify-center gap-6 mb-8 text-sm">
                  <a href="#" className="hover:text-white transition">Twitter/X</a>
                  <a href="#" className="hover:text-white transition">IndieHackers</a>
                  <a href="#" className="hover:text-white transition">Product Hunt</a>
              </div>
              <p className="text-center text-gray-500 italic mb-4">"Save the image. Keep the meaning. Use it forever."</p>
              <p className="text-center text-gray-600 text-sm">© 2026 ImageSnap. All rights reserved.</p>
          </div>
      </footer>

    </div>
  );
};
