import React from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { inisial } from '@/utils/formatters';

/** Judul halaman: label kecil (eyebrow), judul serif besar, deskripsi, dan tombol aksi. */
export const PageHeader: React.FC<{ eyebrow: string; title: string; description?: React.ReactNode; actions?: React.ReactNode }> = ({
  eyebrow,
  title,
  description,
  actions,
}) => (
  <div className="ph">
    <div>
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className="ph-acts">{actions}</div>}
  </div>
);

/** Kartu putih dengan judul opsional. */
export const Card: React.FC<{ title?: React.ReactNode; aside?: React.ReactNode; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  title,
  aside,
  children,
  className = '',
  style,
}) => (
  <div className={`gk-card ${className}`.trim()} style={style}>
    {(title || aside) && (
      <div className="card-head">
        {typeof title === 'string' ? <h3>{title}</h3> : title}
        {aside}
      </div>
    )}
    {children}
  </div>
);

/** Kartu angka ringkasan untuk dashboard. */
export const StatCard: React.FC<{ icon: string; label: string; value: React.ReactNode; sub?: string; href?: string; tone?: 'ok' | 'bad' }> = ({
  icon,
  label,
  value,
  sub,
  href,
  tone,
}) => {
  const body = (
    <>
      <span className={`ic-circle ${tone ?? ''}`}>
        <Icon name={icon} />
      </span>
      <div>
        <div className="stat-label">{label}</div>
        <div className={`stat-num ${tone ?? ''}`}>{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </>
  );
  return href ? (
    <Link href={href} className="stat">
      {body}
    </Link>
  ) : (
    <div className="stat">{body}</div>
  );
};

/** Avatar inisial + nama + keterangan kecil. */
export const Person: React.FC<{ name: string; sub?: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, sub, size = 'sm' }) => (
  <div className="person">
    <span className={`avatar ${size === 'md' ? '' : size}`}>{inisial(name)}</span>
    <div>
      <b>{name}</b>
      {sub && <small>{sub}</small>}
    </div>
  </div>
);

/** Tab filter berbentuk pill dengan jumlah data. */
export function StatusTabs<V extends string>({
  items,
  value,
  onChange,
}: {
  items: { value: V; label: string; count: number; dot: string }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((it) => (
        <button key={it.value || 'all'} type="button" role="tab" aria-selected={value === it.value} className={`tab ${value === it.value ? 'active' : ''}`} onClick={() => onChange(it.value)}>
          <span className={`dot dot-${it.dot}`} />
          {it.label}
          <span className="tab-n">{it.count}</span>
        </button>
      ))}
    </div>
  );
}

/** Kotak pencarian berbentuk pill dengan ikon. */
export const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string; id?: string }> = ({ value, onChange, placeholder, id }) => (
  <label className="search">
    <Icon name="search" />
    <input className="input" id={id} type="search" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} aria-label={placeholder} />
  </label>
);
