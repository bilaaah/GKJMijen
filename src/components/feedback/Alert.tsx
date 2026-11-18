import React from 'react';
import { Icon } from '../common/Icon';

export type AlertTone = 'info' | 'rose' | 'bad' | 'warn' | 'ok';

const DEFAULT_ICON: Record<AlertTone, string> = {
  info: 'info-circle',
  rose: 'info-circle',
  bad: 'exclamation-circle',
  warn: 'exclamation-triangle',
  ok: 'check-circle',
};

export interface AlertProps {
  tone?: AlertTone;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Kotak keterangan/peringatan berwarna lembut. */
export const Alert: React.FC<AlertProps> = ({ tone = 'info', icon, children, className = '', style }) => (
  <div className={`note ${tone === 'info' ? '' : tone} ${className}`.trim()} style={style} role={tone === 'bad' ? 'alert' : undefined}>
    <Icon name={icon ?? DEFAULT_ICON[tone]} />
    <div>{children}</div>
  </div>
);
