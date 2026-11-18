import React from 'react';
import Link from 'next/link';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'white' | 'outline-light';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline-primary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  white: 'btn-light',
  'outline-light': 'btn-outline-light',
};

export function buttonClass(variant: ButtonVariant = 'primary', size: 'sm' | 'md' = 'md', extra = ''): string {
  return `btn ${VARIANT_CLASS[variant]} ${size === 'sm' ? 'btn-sm' : ''} ${extra}`.replace(/\s+/g, ' ').trim();
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: string;
  isLoading?: boolean;
  block?: boolean;
}

/** Tombol berbentuk pill dengan warna palet GKJ Mijen (berbasis .btn Bootstrap 5). */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  block = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => (
  <button type={type} className={buttonClass(variant, size, `${block ? 'w-100' : ''} ${className}`)} disabled={disabled || isLoading} {...props}>
    {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : icon ? <Icon name={icon} /> : null}
    {children}
  </button>
);

export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: string;
  block?: boolean;
}

/** Link yang tampil seperti tombol. */
export const ButtonLink: React.FC<ButtonLinkProps> = ({ href, variant = 'primary', size = 'md', icon, block = false, className = '', children, ...props }) => (
  <Link href={href} className={buttonClass(variant, size, `${block ? 'w-100' : ''} ${className}`)} {...props}>
    {icon && <Icon name={icon} />}
    {children}
  </Link>
);

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  danger?: boolean;
}

/** Tombol bulat kecil berisi ikon saja, misalnya aksi Lihat/Ubah/Hapus di tabel. */
export const IconButton: React.FC<IconButtonProps> = ({ icon, label, danger = false, className = '', type = 'button', ...props }) => (
  <button type={type} className={`icon-btn ${danger ? 'danger' : ''} ${className}`.trim()} title={label} aria-label={label} {...props}>
    <Icon name={icon} />
  </button>
);
