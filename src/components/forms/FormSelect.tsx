import React from 'react';
import type { SelectOption } from '@/types/common.types';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label} {props.required && <span className="text-danger">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`form-select ${error ? 'is-invalid' : ''} ${className}`.trim()}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <div className="invalid-feedback">{error}</div>}
        {!error && helperText && <div className="form-text">{helperText}</div>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
