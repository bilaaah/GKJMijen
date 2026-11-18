import React from 'react';
import type { SelectOption } from '@/types/common.types';
import { Field } from './Field';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: React.ReactNode;
  options: SelectOption[];
  placeholder?: string;
  fieldClassName?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, options, placeholder, fieldClassName, className = '', id, required, ...props }, ref) => (
    <Field label={label} htmlFor={id} required={required} error={error} helperText={helperText} className={fieldClassName}>
      <select id={id} ref={ref} className={`input ${error ? 'invalid' : ''} ${className}`.trim()} aria-invalid={!!error} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  )
);
FormSelect.displayName = 'FormSelect';

/** Select ringkas untuk baris filter (tanpa label). */
export const FilterSelect: React.FC<{ id: string; label: string; value: string; onChange: (v: string) => void; options: SelectOption[] }> = ({ id, label, value, onChange, options }) => (
  <select id={id} className="input" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
