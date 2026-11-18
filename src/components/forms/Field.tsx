import React from 'react';

/** Pembungkus label + kontrol + teks bantuan + pesan error. */
export const Field: React.FC<{
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ label, htmlFor, required, error, helperText, className = '', children }) => (
  <div className={`field ${className}`.trim()}>
    {label &&
      (htmlFor ? (
        <label htmlFor={htmlFor}>
          {label}
          {required && <span className="req"> *</span>}
        </label>
      ) : (
        <span className="lbl">
          {label}
          {required && <span className="req"> *</span>}
        </span>
      ))}
    {children}
    {helperText && <div className="hint">{helperText}</div>}
    {error && <div className="err">{error}</div>}
  </div>
);
