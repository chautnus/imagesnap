/**
 * IMAGESNAP — Centralized Color & Theme Tokens
 *
 * ALL bg, text, border colors must be sourced from this file.
 * Do NOT hardcode any color classes (bg-*, text-*, border-*) in components.
 * Instead: import { PUB } or { APP } and use the token.
 *
 * Two themes:
 *   PUB  — dark,  for marketing / public pages (landing, blog, pricing, alternatives, tools)
 *   APP  — light, for the authenticated dashboard (Capture, Data, Settings, Help)
 */

// ---------------------------------------------------------------------------
// PUBLIC THEME — dark marketing pages
// ---------------------------------------------------------------------------
export const PUB = {
  // Page root
  page:        'bg-[#0a0a0c] text-white font-sans antialiased',

  // Navigation
  navBg:       'bg-[#0a0a0c] border-b border-white/10',
  navText:     'text-[#a1a1aa] hover:text-white transition-colors',
  navDropdown: 'bg-[#111114] border border-white/10 rounded-2xl shadow-2xl',

  // Surfaces
  card:        'bg-white/5 border border-white/10 rounded-2xl',
  cardHover:   'hover:border-accent/30 hover:bg-white/[0.08] transition-all',
  cardAccent:  'bg-accent/[0.05] border border-accent/20 rounded-2xl',
  glass:       'bg-white/5 backdrop-blur-xl border border-white/10',
  glassDark:   'bg-[#111114]/90 backdrop-blur-2xl border border-white/10',
  section:     'bg-white/[0.02] border-y border-white/10',
  divider:     'border-white/10',

  // Typography
  textPrimary: 'text-white',
  textMuted:   'text-[#a1a1aa]',
  textAccent:  'text-accent',
  heading:     'font-black tracking-tight text-white',

  // Buttons
  btnPrimary:  'bg-accent text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity',
  btnGhost:    'bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-colors',
  btnGhostHover: 'hover:text-white transition-colors',

  // Overlays & modals
  overlay:     'bg-black/80 backdrop-blur-sm',
  modal:       'bg-[#111114] border border-white/10 rounded-[2.5rem] shadow-2xl',

  // Form elements (in dark context)
  input:       'bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors placeholder:text-[#a1a1aa]',

  // Icons on dark bg
  icon:        'text-[#a1a1aa]',
  iconAccent:  'text-accent',
} as const;

// ---------------------------------------------------------------------------
// APP THEME — light dashboard
// ---------------------------------------------------------------------------
export const APP = {
  // Page root (mirrors CSS vars in index.css)
  page:        'bg-[#F0F4FF] text-[#1E293B] font-sans antialiased',

  // Surfaces
  card:        'bg-white border border-[#E2E8F0] rounded-2xl shadow-sm',
  cardHover:   'hover:border-[#4F6EF7]/40 hover:shadow-md transition-all',

  // Typography
  textPrimary: 'text-[#1E293B]',
  textMuted:   'text-[#94A3B8]',
  textAccent:  'text-[#4F6EF7]',
  label:       'text-[11px] text-[#94A3B8] font-semibold uppercase tracking-[0.08em]',

  // Borders
  border:      'border-[#E2E8F0]',
  divider:     'border-[#E2E8F0]',

  // Buttons
  btnPrimary:  'bg-[#4F6EF7] text-white font-semibold rounded-xl hover:bg-[#4F6EF7]/90 shadow-sm transition-opacity',
  btnSecondary: 'bg-white border border-[#E2E8F0] text-[#1E293B] rounded-xl hover:bg-[#F0F4FF] transition-colors',

  // Inputs
  input:       'bg-white border border-[#E2E8F0] text-[#1E293B] rounded-xl px-4 py-3 focus:outline-none focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#4F6EF7]/20 transition-all placeholder:text-[#94A3B8]',
} as const;
