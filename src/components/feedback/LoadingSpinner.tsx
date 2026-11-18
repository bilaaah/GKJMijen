import React from 'react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Memuat data...', size = 'md' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center p-4">
    <div className={`spinner-border ${size === 'sm' ? 'spinner-border-sm' : ''}`} style={{ color: 'var(--maroon)' }} role="status">
      <span className="visually-hidden">{label}</span>
    </div>
    {label && <small className="muted mt-2">{label}</small>}
  </div>
);
