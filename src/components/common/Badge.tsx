import React from 'react';
import type { Tone } from '@/lib/data/constants';

export interface BadgeProps {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** Label status berbentuk pill. tone: ok (hijau), warn (kuning), info (biru), bad (merah), neu (abu), rose. */
export const Badge: React.FC<BadgeProps> = ({ tone = 'neu', dot = true, children, className = '' }) => (
  <span className={`gk-badge b-${tone} ${dot ? '' : 'nodot'} ${className}`.trim()}>{children}</span>
);

export const YesNoBadge: React.FC<{ value: boolean }> = ({ value }) => (value ? <Badge tone="ok">Sudah</Badge> : <Badge tone="neu">Belum</Badge>);
