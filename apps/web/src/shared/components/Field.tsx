import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldShellProps {
  id: string
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  error?: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  error?: string
  children: ReactNode
}

function FieldShell({ id, label, error, required, children }: FieldShellProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required ? <span className="field-required">*</span> : null}
      </label>
      {children}
      {error ? (
        <span className="field-hint field-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </div>
  )
}

export function TextField({ id, label, error, required, ...props }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} required={required}>
      <input className="input-box" id={id} aria-describedby={error ? `${id}-error` : undefined} {...props} />
    </FieldShell>
  )
}

export function TextAreaField({ id, label, error, required, ...props }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} required={required}>
      <textarea className="input-box text-area" id={id} aria-describedby={error ? `${id}-error` : undefined} {...props} />
    </FieldShell>
  )
}

export function SelectField({ id, label, error, required, children, ...props }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} required={required}>
      <select className="input-box" id={id} aria-describedby={error ? `${id}-error` : undefined} {...props}>
        {children}
      </select>
    </FieldShell>
  )
}
