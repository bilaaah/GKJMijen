'use client';

import React from 'react';
import { Icon } from '../common/Icon';

/** Saklar on/off dengan judul dan keterangan. */
export const Switch: React.FC<{ id: string; label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ id, label, description, checked, onChange }) => (
  <label className="switch-row" htmlFor={id}>
    <span>
      <b>{label}</b>
      {description && <small>{description}</small>}
    </span>
    <input type="checkbox" className="switch" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
  </label>
);

/** Pilihan radio berbentuk pill. */
export function RadioPills<V extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: V; label: React.ReactNode; dot?: string; disabled?: boolean }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div className="radio-pills" role="radiogroup">
      {options.map((o) => (
        <label key={o.value} className={`${value === o.value ? 'on' : ''} ${o.disabled ? 'disabled' : ''}`.trim()}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} />
          {o.dot && <span className={`dot dot-${o.dot}`} />}
          {o.label}
        </label>
      ))}
    </div>
  );
}

/** Tombol bersegmen (mis. Pemasukan / Pengeluaran, Tabel / Kalender). */
export function Segmented<V extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: V; label: string; icon?: string; tone?: 'ok' | 'bad' }[];
  value: V;
  onChange: (v: V) => void;
  label?: string;
}) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={`${value === o.value ? 'on' : ''} ${o.tone ?? ''}`.trim()} onClick={() => onChange(o.value)}>
          {o.icon && <Icon name={o.icon} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}
