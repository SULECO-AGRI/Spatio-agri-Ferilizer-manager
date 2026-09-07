import { memo, type ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  value?: string | number;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  hint?: string;
  className?: string;
  required?: boolean;
  children?: ReactNode;
}

export const FormField = memo(function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  error,
  helperText,
  hint,
  className = "",
  required = false,
  children,
}: FormFieldProps) {
  const displayHint = helperText || hint;

  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      <label className="text-xs text-slate-500 font-normal block">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      {children ? (
        children
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full border rounded-lg p-2.5 text-xs font-normal transition-colors focus:outline-hidden ${
            disabled
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              : error
                ? "bg-white border-rose-300 text-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                : "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
          }`}
        />
      )}

      {error ? (
        <p className="text-[10px] text-rose-500 font-normal">{error}</p>
      ) : displayHint ? (
        <p className="text-[10px] text-slate-400 font-normal">{displayHint}</p>
      ) : null}
    </div>
  );
});

export default FormField;
