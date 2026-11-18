'use client';

import React, { useState } from 'react';
import { Field } from './Field';
import { Icon } from '../common/Icon';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: React.ReactNode;
  fieldClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, fieldClassName, className = '', id, required, ...props }, ref) => (
    <Field label={label} htmlFor={id} required={required} error={error} helperText={helperText} className={fieldClassName}>
      <input id={id} ref={ref} className={`input ${error ? 'invalid' : ''} ${className}`.trim()} aria-invalid={!!error} {...props} />
    </Field>
  )
);
FormInput.displayName = 'FormInput';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: React.ReactNode;
  fieldClassName?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, fieldClassName, className = '', id, required, ...props }, ref) => (
    <Field label={label} htmlFor={id} required={required} error={error} helperText={helperText} className={fieldClassName}>
      <textarea id={id} ref={ref} className={`input ${error ? 'invalid' : ''} ${className}`.trim()} aria-invalid={!!error} {...props} />
    </Field>
  )
);
FormTextarea.displayName = 'FormTextarea';

/** Input kata sandi dengan tombol tampil/sembunyi. */
export const PasswordInput: React.FC<Omit<FormInputProps, 'type'>> = ({ label, error, helperText, fieldClassName, id, required, className = '', ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} htmlFor={id} required={required} error={error} helperText={helperText} className={fieldClassName}>
      <div className="pw">
        <input id={id} type={show ? 'text' : 'password'} className={`input ${error ? 'invalid' : ''} ${className}`.trim()} aria-invalid={!!error} {...props} />
        <button type="button" className="pw-eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
          <Icon name={show ? 'eye-slash' : 'eye'} />
        </button>
      </div>
    </Field>
  );
};

/** Input nominal Rupiah: otomatis memberi titik ribuan. */
export const RupiahInput: React.FC<{ id: string; label?: string; value: number; onChange: (n: number) => void; error?: string; required?: boolean; fieldClassName?: string }> = ({
  id,
  label,
  value,
  onChange,
  error,
  required,
  fieldClassName,
}) => (
  <Field label={label} htmlFor={id} required={required} error={error} className={fieldClassName}>
    <div className="prefix">
      <span>Rp</span>
      <input
        id={id}
        className={`input ${error ? 'invalid' : ''}`}
        inputMode="numeric"
        placeholder="0"
        value={value ? value.toLocaleString('id-ID') : ''}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
        aria-invalid={!!error}
      />
    </div>
  </Field>
);
