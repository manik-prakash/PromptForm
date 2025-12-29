
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';

interface BaseInputProps {
    label?: string;
    error?: string;
    helperText?: string;
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = BaseInputProps & SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string }[];
};

const baseInputStyles = `
  w-full px-3 py-2
  bg-white border border-border rounded-lg
  text-text placeholder:text-text-muted
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
  disabled:bg-surface disabled:cursor-not-allowed
  transition-colors duration-150
`;

const errorInputStyles = 'border-error focus:ring-error';

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-text">
                        {label}
                        {props.required && <span className="text-error-text ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`${baseInputStyles} ${error ? errorInputStyles : ''} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-error-text">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-text-muted">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, className = '', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-text">
                        {label}
                        {props.required && <span className="text-error-text ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    rows={4}
                    className={`${baseInputStyles} resize-none ${error ? errorInputStyles : ''} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-error-text">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-text-muted">{helperText}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-text">
                        {label}
                        {props.required && <span className="text-error-text ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={`${baseInputStyles} ${error ? errorInputStyles : ''} ${className}`}
                    {...props}
                >
                    <option value="">Select an option</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-error-text">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-text-muted">{helperText}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
