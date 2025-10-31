'use client'

import { useState, useTransition } from 'react'

export type ServerAction<T> = (formData: FormData) => Promise<{
  values?: T
  errors?: Partial<Record<keyof T, string>>
  formError?: string
}>

export function useFormAction<T extends Record<string, unknown>>(action: ServerAction<T>, initialValues: T) {
  const [isPending, startTransition] = useTransition()

  // 2. Thêm 'formError' vào state
  const [state, setState] = useState<{
    values: T
    errors: Partial<Record<keyof T, string>>
    formError: string | null // Thêm lỗi chung
  }>({
    values: initialValues,
    errors: {},
    formError: null // Khởi tạo là null
  })

  const formAction = (formData: FormData) => {
    // Reset cả 2 loại lỗi khi submit
    setState((prev) => ({ ...prev, errors: {}, formError: null }))

    startTransition(async () => {
      const result = await action(formData)

      if (result) {
        setState((prev) => ({
          values: { ...prev.values, ...(result.values || {}) },
          errors: result.errors || {},
          formError: result.formError || null // 3. Cập nhật lỗi chung
        }))
      }
    })
  }

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      // Khi gõ, xóa lỗi của trường đó VÀ lỗi chung
      errors: { ...prev.errors, [field]: undefined },
      formError: null
    }))
  }

  const reset = () =>
    setState({
      values: initialValues,
      errors: {},
      formError: null
    })

  // 4. Trả về 'formError'
  return {
    values: state.values,
    errors: state.errors,
    formError: state.formError, // Trả về lỗi chung
    updateField,
    reset,
    formAction,
    isPending
  }
}
