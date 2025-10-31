'use client'

import { registerAction } from '@/lib/auth.actions'
import { useFormAction } from '@/hooks/use-form-action'
import { RegisterForm } from '@/app/_components/register-form'

export type RegisterFormValues = {
  email: string
  password: string
  name: string
  confirmPassword: string
}

export default function RegisterPage() {
  const { values, errors, formError, updateField, formAction, isPending } = useFormAction<RegisterFormValues>(
    registerAction,
    {
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    }
  )

  return (
    <RegisterForm
      formAction={formAction}
      isSubmitting={isPending}
      state={{ error: formError ?? null }}
      values={values}
      errors={errors}
      updateField={updateField}
    />
  )
}
