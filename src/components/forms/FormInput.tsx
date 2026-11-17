import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label} {props.required && <span className="text-danger">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`form-control ${error ? 'is-invalid' : ''} ${className}`.trim()}
          {...props}
        />
        {error && <div className="invalid-feedback">{error}</div>}
        {!error && helperText && <div className="form-text">{helperText}</div>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
