'use client';

import { themeStyle } from '@/lib/theme';
import type { Theme } from '@/lib/types';

type StageProps = {
  width: number;
  height: number;
  theme: Theme;
  children: React.ReactNode;
  className?: string;
};

/**
 * Stage is the fixed-size root element for all templates.
 * It applies theme CSS variables and clips overflow.
 * The #stage id is used by Puppeteer to screenshot this element.
 */
export function Stage({ width, height, theme, children, className = '' }: StageProps) {
  return (
    <div
      id="stage"
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.primary,
        ...themeStyle(theme),
      }}
    >
      {children}
    </div>
  );
}
