import React from 'react';

/** Ikon dari Bootstrap Icons, contoh: <Icon name="people" /> */
export const Icon: React.FC<{ name: string; className?: string; style?: React.CSSProperties }> = ({ name, className = '', style }) => (
  <i className={`bi bi-${name} ${className}`.trim()} style={style} aria-hidden="true" />
);
