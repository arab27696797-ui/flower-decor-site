import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type BaseFieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

type AdminInputFieldProps = BaseFieldProps & {
  as?: 'input'
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}

type AdminTextareaFieldProps = BaseFieldProps & {
  as: 'textarea'
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

type AdminFormFieldProps = AdminInputFieldProps | AdminTextareaFieldProps

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: BaseFieldProps & { children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium leading-6 text-brand-ink">
        {label}
        {required ? <span className="ml-1 text-brand-forest">*</span> : null}
      </label>

      {children}

      {error ? (
        <p className="text-sm leading-5 text-red-700">{error}</p>
      ) : hint ? (
        <p className="text-sm leading-5 text-brand-ink/65">{hint}</p>
      ) : null}
    </div>
  )
}

const fieldClassName =
  'w-full rounded-card border border-brand-ink/10 bg-white px-4 py-3 text-sm text-brand-ink shadow-sm transition-colors duration-200 placeholder:text-brand-ink/35 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:cursor-not-allowed disabled:bg-brand-cream disabled:text-brand-ink/45'

export function AdminFormField(props: AdminFormFieldProps) {
  if (props.as === 'textarea') {
    const { id, label, hint, error, required, className, textareaProps } = props

    return (
      <FieldShell
        id={id}
        label={label}
        hint={hint}
        error={error}
        required={required}
        className={className}
      >
        <textarea
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? `${id}-meta` : undefined}
          className={cn(fieldClassName, 'min-h-[132px] resize-y')}
          {...textareaProps}
        />
        {hint || error ? <span id={`${id}-meta`} className="sr-only" /> : null}
      </FieldShell>
    )
  }

  const { id, label, hint, error, required, className, inputProps } = props

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? `${id}-meta` : undefined}
        className={fieldClassName}
        {...inputProps}
      />
      {hint || error ? <span id={`${id}-meta`} className="sr-only" /> : null}
    </FieldShell>
  )
}
