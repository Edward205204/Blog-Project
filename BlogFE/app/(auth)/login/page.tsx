'use client'

import { LoginForm } from '@/app/_components/login-form'
import { loginAction } from '@/lib/auth.actions'

import { useFormAction } from '@/hooks/use-form-action'

export type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const { values, errors, formError, updateField, formAction, isPending } = useFormAction<LoginFormValues>(
    loginAction,
    {
      email: '',
      password: ''
    }
  )

  return (
    <LoginForm
      formAction={formAction}
      isSubmitting={isPending}
      state={{ error: formError ?? null }}
      values={values}
      errors={errors}
      updateField={updateField}
    />
  )
}
