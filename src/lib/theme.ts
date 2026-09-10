import type { Agent, Theme } from './types';

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
  title: 'Realtor · PEI',
  phone: '902-888-9232',
  email: 'gcaseleyrealty@gmail.com',
  website: 'peislandrealty.ca',
  headshotUrl: '/agents/greg/headshot.png',
  logoUrl: '/agents/greg/logo.png',
  theme: gregTheme,
};

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
