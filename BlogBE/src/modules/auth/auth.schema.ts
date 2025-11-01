import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Tên cần ít nhất 3 kí tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu cần ít nhất 6 kí tự')
  })
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Password Mật khẩu cần ít nhất 6 kí tự')
  })
})

export const refreshSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1, 'Refresh token không hợp lệ')
  })
})
