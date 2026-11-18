'use client';

import React, { useEffect } from 'react';
import { IconButton } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg';
  centered?: boolean;
}

/** Modal dialog bergaya GKJ Mijen. Tutup dengan klik latar, tombol X, atau tombol Esc. */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children, footer, size = 'md', centered = false }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="gk-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`gk-modal ${size === 'lg' ? 'wide' : ''}`} role="dialog" aria-modal="true">
        <IconButton icon="x-lg" label="Tutup" className="x" onClick={onClose} />
        <div className={centered ? 'modal-center' : ''}>
          {title && <h3>{title}</h3>}
          {subtitle && <p className="muted" style={{ margin: '0 0 16px' }}>{subtitle}</p>}
          {children}
          {footer && <div className="modal-acts">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
