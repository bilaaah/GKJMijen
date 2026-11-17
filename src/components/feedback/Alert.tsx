import React from 'react';

export interface AlertProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
}) => {
  return (
    <div className={`alert alert-${variant} ${dismissible ? 'alert-dismissible fade show' : ''}`} role="alert">
      {title && <h6 className="alert-heading">{title}</h6>}
      <div>{children}</div>
      {dismissible && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onDismiss} />
      )}
    </div>
  );
};
