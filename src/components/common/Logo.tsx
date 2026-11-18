import React from 'react';
import Link from 'next/link';

/**
 * Lambang GKJ (public/images/logo-gkj-transparan.png) yang diwarnai lewat CSS mask.
 * tone "light" = Rose Soft untuk latar gelap, "maroon" = untuk latar terang.
 */
export const LogoMark: React.FC<{ tone?: 'light' | 'maroon'; size?: 'md' | 'xl'; label?: string }> = ({ tone = 'light', size = 'md', label }) => (
  <span
    className={`logo-mark ${tone === 'maroon' ? 'maroon' : ''} ${size === 'xl' ? 'xl' : ''}`.trim()}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  />
);

/** Logo + tulisan "GKJ Mijen / SEMARANG". */
export const Logo: React.FC<{ href?: string }> = ({ href = '/dashboard' }) => (
  <Link className="logo" href={href}>
    <LogoMark label="Logo Gereja-Gereja Kristen Jawa" />
    <span className="logo-tx">
      <b>GKJ Mijen</b>
      <small>SEMARANG</small>
    </span>
  </Link>
);
