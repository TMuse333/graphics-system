import type { Agent, Theme } from './types';

// ============ GREG CASELEY — navy + gold ============

export const gregTheme: Theme = {
  primary: '#141428',
  primaryAlt: '#22224a',
  accent: '#d4af37',
  accentLight: '#f0dc9a',
  // Light-ground tokens. accentText is a darkened gold: #d4af37 on cream is
  // 1.9:1 and unreadable as label text.
  surface: '#f6f4ef',
  surfaceAlt: '#ffffff',
  ink: '#16162c',
  inkSoft: '#4a4a5e',
  accentText: '#664d05',
  fontDisplay: 'Archivo, sans-serif',
  fontNarrow: "'Archivo Narrow', sans-serif",
  fontScript: 'Yellowtail, cursive',
};

export const greg: Agent = {
  _id: 'greg-caseley',
  name: 'Greg Caseley',
  title: 'Realtor · Prince Edward Island',
  phone: '902-888-9232',
  email: 'gcaseleyrealty@gmail.com',
  website: 'peislandrealty.ca',
  headshotUrl: '/agents/greg/headshot.png',
  logoUrl: '/agents/greg/logo.png',
  theme: gregTheme,
};

// ============ BROKERAGE — red / white / blue ============
// Placeholder palette for the brokerage pitch. Swap for official brand
// values before showing it to a franchise marketing team.

export const brokerageTheme: Theme = {
  primary: '#0a2a66',
  primaryAlt: '#12409b',
  accent: '#d92b2b',
  accentLight: '#b81f1f',
  surface: '#f4f2ed',
  surfaceAlt: '#ffffff',
  ink: '#12172a',
  inkSoft: '#4d5468',
  accentText: '#a01212',
  fontDisplay: 'Archivo, sans-serif',
  fontNarrow: "'Archivo Narrow', sans-serif",
  fontScript: 'Yellowtail, cursive',
};

// ============ CONTRAST TEST BRAND — clay + amber ============
// Deliberately far from Greg on every axis so a template rendering correctly
// in both proves the theme abstraction rather than proving two navies match.

export const clayTheme: Theme = {
  primary: '#5a2a20',
  primaryAlt: '#8f4331',
  accent: '#e8a33d',
  accentLight: '#fbe3b4',
  surface: '#faf5ee',
  surfaceAlt: '#ffffff',
  ink: '#2a1712',
  inkSoft: '#5c463e',
  accentText: '#8a4a0c',
  fontDisplay: "'Playfair Display', serif",
  fontNarrow: 'Oswald, sans-serif',
  fontScript: 'Parisienne, cursive',
};

export const testAgent: Agent = {
  _id: 'dana-whitfield',
  name: 'Dana Whitfield',
  title: 'Broker · Annapolis Valley',
  phone: '902-555-0148',
  email: 'dana@valleyhomes.ca',
  website: 'valleyhomes.ca',
  headshotUrl: '/agents/dana/headshot.png',
  logoUrl: '/agents/dana/logo.png',
  theme: clayTheme,
};

// Aliases for backwards compatibility
export const remaxTheme = brokerageTheme;

export const demoAgent: Agent = {
  _id: 'demo-agent',
  name: 'Sarah Mitchell',
  title: 'Realtor · RE/MAX Nova',
  phone: '902-434-5678',
  email: 'sarah@remaxnova.ca',
  website: 'remaxnova.ca',
  headshotUrl: '/agents/greg/headshot.png',
  logoUrl: '',
  theme: brokerageTheme,
};

/**
 * Fonts a theme can reference. The render page must load the fonts for the
 * agent being rendered — a fixed @font-face list silently falls back and
 * produces PNGs that look almost right.
 */
export const THEME_FONTS: Record<string, string> = {
  Archivo: '/fonts/Archivo-Variable.woff2',
  'Archivo Narrow': '/fonts/ArchivoNarrow-Variable.woff2',
  Yellowtail: '/fonts/Yellowtail-Regular.woff2',
  'Playfair Display': '/fonts/PlayfairDisplay-Variable.woff2',
  Oswald: '/fonts/Oswald-Variable.woff2',
  Parisienne: '/fonts/Parisienne-Regular.woff2',
};

export const fontsForTheme = (theme: Theme): string[] =>
  [theme.fontDisplay, theme.fontNarrow, theme.fontScript]
    .map(stack => stack.split(',')[0].trim().replace(/^["']|["']$/g, ''))
    .filter(name => name in THEME_FONTS);

/** Bevelled display type — the layered shadow stack used on headlines. */
export const bevel = (a: string, b: string, c: string, glow = 'rgba(4,6,18,.7)') =>
  `0 2px 0 ${a}, 0 4px 0 ${b}, 0 6px 0 ${c}, 0 10px 24px ${glow}`;

export const goldBevel = bevel('#b8912a', '#96751f', '#6f5716');
export const silverBevel = bevel('#7d879c', '#565f74', '#343b4e');

/** Convert a Theme to CSS custom properties for the stage element. */
export const themeToVars = (theme: Theme): Record<string, string> => ({
  '--theme-primary': theme.primary,
  '--theme-primary-alt': theme.primaryAlt,
  '--theme-accent': theme.accent,
  '--theme-accent-light': theme.accentLight,
  '--theme-accent-text': theme.accentText ?? theme.ink ?? '#16162c',
  '--theme-surface': theme.surface ?? '#f6f4ef',
  '--theme-surface-alt': theme.surfaceAlt ?? '#ffffff',
  '--theme-ink': theme.ink ?? '#16162c',
  '--theme-ink-soft': theme.inkSoft ?? '#4a4a5e',
  '--theme-font-display': theme.fontDisplay,
  '--theme-font-narrow': theme.fontNarrow,
  '--theme-font-script': theme.fontScript,
});

export const themeStyle = (theme: Theme): React.CSSProperties =>
  themeToVars(theme) as unknown as React.CSSProperties;
