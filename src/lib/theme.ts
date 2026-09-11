import type { Agent, Theme } from './types';

// ============ GREG CASELEY — navy + gold ============

export const gregTheme: Theme = {
  primary: '#141428',
  primaryAlt: '#22224a',
  accent: '#d4af37',
  accentLight: '#f0dc9a',
  fontDisplay: 'Archivo, sans-serif',
  fontNarrow: '"Archivo Narrow", sans-serif',
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

// ============ ROBERT MUSIAL — RE/MAX blue + red ============

export const remaxTheme: Theme = {
  primary: '#003da5',
  primaryAlt: '#002868',
  accent: '#dc1c2e',
  accentLight: '#f5a5ad',
  fontDisplay: 'Archivo, sans-serif',
  fontNarrow: '"Archivo Narrow", sans-serif',
  fontScript: 'Yellowtail, cursive',
};

export const robertMusial: Agent = {
  _id: 'robert-musial',
  name: 'Robert Musial',
  title: 'Realtor · RE/MAX Nova',
  phone: '902-555-0199',
  email: 'robert@remaxnova.ca',
  website: 'remaxnova.ca',
  headshotUrl: '',
  logoUrl: '',
  theme: remaxTheme,
};

// ============ TEST BRAND — clay + amber ============

export const clayTheme: Theme = {
  primary: '#5a2a20',
  primaryAlt: '#8f4331',
  accent: '#e8a33d',
  accentLight: '#fbe3b4',
  fontDisplay: '"Playfair Display", serif',
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

/**
 * Fonts a theme can reference. The render page must load the fonts for the
 * agent being rendered.
 */
export const THEME_FONTS: Record<string, string> = {
  Archivo: '/fonts/Archivo-Variable.woff2',
  'Archivo Narrow': '/fonts/ArchivoNarrow-Variable.woff2',
  Yellowtail: '/fonts/Yellowtail-Regular.woff2',
  'Playfair Display': '/fonts/PlayfairDisplay-Variable.woff2',
  Oswald: '/fonts/Oswald-Variable.woff2',
  Parisienne: '/fonts/Parisienne-Regular.woff2',
};

/** Font families a theme needs, for building @font-face rules per render. */
export const fontsForTheme = (theme: Theme): string[] =>
  [theme.fontDisplay, theme.fontNarrow, theme.fontScript]
    .map(stack => stack.split(',')[0].trim().replace(/^["']|["']$/g, ''))
    .filter(name => name in THEME_FONTS);

/** Bevelled display type — the layered shadow stack used on headlines. */
export const bevel = (a: string, b: string, c: string, glow = 'rgba(4,6,18,.7)') =>
  `0 2px 0 ${a}, 0 4px 0 ${b}, 0 6px 0 ${c}, 0 10px 24px ${glow}`;

export const goldBevel = bevel('#b8912a', '#96751f', '#6f5716');
export const silverBevel = bevel('#7d879c', '#565f74', '#343b4e');

/** Convert a Theme to CSS custom properties for the stage element */
export const themeToVars = (theme: Theme): Record<string, string> => ({
  '--theme-primary': theme.primary,
  '--theme-primary-alt': theme.primaryAlt,
  '--theme-accent': theme.accent,
  '--theme-accent-light': theme.accentLight,
  '--theme-font-display': theme.fontDisplay,
  '--theme-font-narrow': theme.fontNarrow,
  '--theme-font-script': theme.fontScript,
});

/** Apply theme as inline style object */
export const themeStyle = (theme: Theme): React.CSSProperties =>
  themeToVars(theme) as unknown as React.CSSProperties;
