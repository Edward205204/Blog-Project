'use client'

import { Field, FieldDescription, FieldLabel } from './field'
import { Input } from './input'
import { cn } from '@/lib/utils'
import { useStableError } from '@/hooks/use-state-err'
import React from 'react'

type InputWithErrorProps<T extends object> = {
  name: string
  label?: string
  value?: string
  placeholder?: string
  error?: Partial<Record<keyof T, string>> | string
  type?: string
  onChange?: (value: string) => void
  description?: string
  /** custom input component, e.g. PasswordInput */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any>
}

export function InputWithError<T extends object>({
  name,
  label,
  value,
  placeholder,
  error,
  type = 'text',
  onChange,
  description,
  as: CustomInput
}: InputWithErrorProps<T>) {
  const { ref, style, hasError } = useStableError<T>(error)
  const InputComp = CustomInput ?? Input

  return (
    <Field>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <InputComp
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
        className={cn(hasError && 'border-destructive focus-visible:ring-destructive')}
      />

      <div ref={ref} style={style}>
        {typeof error === 'string' ? (
          <FieldDescription className='text-destructive'>{error}</FieldDescription>
        ) : (
          Object.entries(error ?? {}).map(([key, msg]) =>
            typeof msg === 'string' ? (
              <FieldDescription key={key} className='text-destructive'>
                {msg}
              </FieldDescription>
            ) : null
          )
        )}

        {!hasError && description && <FieldDescription className='opacity-60'>{description}</FieldDescription>}
      </div>
    </Field>
  )
}
