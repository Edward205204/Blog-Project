// 'use server'

// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import { apiClient } from './api-client'
// import { BaseResponse } from '@/@types/base-response'
// import { AuthResponse } from '@/@types/auth-response'
// import URL from '@/constants/url'
// import { CONFIG_ENV } from '@/constants/config.env'

// type FormErrors = Partial<{
//   email: string
//   password: string
//   name: string
//   confirmPassword: string
// }>

// export async function loginAction(formData: FormData): Promise<{ errors?: FormErrors; formError?: string }> {
//   const email = formData.get('email')?.toString() ?? ''
//   const password = formData.get('password')?.toString() ?? ''
//   const errors: FormErrors = {}
//   if (!email) errors.email = 'Email không được để trống'
//   if (!password) errors.password = 'Mật khẩu không được để trống'
//   if (Object.keys(errors).length > 0) return { errors }

//   try {
//     const res = await apiClient.post<BaseResponse<AuthResponse>>('/auth/login', { email, password })
//     if (!res.success) {
//       return { formError: res.message }
//     }

//     const authData = res.data

//     const cookieStore = await cookies()

//     cookieStore.set('accessToken', authData.accessToken, {
//       httpOnly: true,
//       secure: CONFIG_ENV.NODE_ENV === 'production',
//       maxAge: CONFIG_ENV.ACCESS_TOKEN_EXPIRES_IN,
//       path: '/'
//     })

//     cookieStore.set('refreshToken', authData.refreshToken, {
//       httpOnly: true,
//       secure: CONFIG_ENV.NODE_ENV === 'production',
//       maxAge: CONFIG_ENV.REFRESH_TOKEN_EXPIRES_IN,
//       path: '/'
//     })
//   } catch (error) {
//     if (
//       typeof error === 'object' &&
//       error !== null &&
//       'details' in error &&
//       typeof (error as unknown as { details?: { errors?: Record<string, string[]> } }).details === 'object'
//     ) {
//       const objectError = (error as unknown as { details?: { errors?: Record<string, string[]> } }).details?.errors as
//         | Record<string, string[]>
//         | undefined
//       if (objectError) {
//         for (const key in objectError) {
//           if (objectError[key]?.length) {
//             errors[key as keyof FormErrors] = objectError[key][0]
//           }
//         }
//         return { errors }
//       }
//     }

//     const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
//     return { formError: message }
//   }

//   redirect(URL.HOME)
// }

// export async function registerAction(formData: FormData): Promise<{ errors?: FormErrors; formError?: string }> {
//   const email = formData.get('email')?.toString() ?? ''
//   const password = formData.get('password')?.toString() ?? ''
//   const name = formData.get('name')?.toString() ?? ''
//   const confirmPassword = formData.get('confirmPassword')?.toString() ?? ''

//   const errors: FormErrors = {}
//   if (!email) errors.email = 'Email không được để trống'
//   if (!password) errors.password = 'Mật khẩu không được để trống'
//   if (!name) errors.name = 'Username không được để trống'
//   if (!confirmPassword) errors.confirmPassword = 'Xác nhận mật khẩu không được để trống'
//   if (password !== confirmPassword) errors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu không khớp'
//   if (Object.keys(errors).length > 0) return { errors }

//   try {
//     const res = await apiClient.post<BaseResponse<AuthResponse>>('/auth/register', { email, password, name })
//     if (!res.success) {
//       return { formError: res.message }
//     }

//     const authData = res.data

//     const cookieStore = await cookies()

//     cookieStore.set('accessToken', authData.accessToken, {
//       httpOnly: true,
//       secure: CONFIG_ENV.NODE_ENV === 'production',
//       maxAge: CONFIG_ENV.ACCESS_TOKEN_EXPIRES_IN,
//       path: '/'
//     })

//     cookieStore.set('refreshToken', authData.refreshToken, {
//       httpOnly: true,
//       secure: CONFIG_ENV.NODE_ENV === 'production',
//       maxAge: CONFIG_ENV.REFRESH_TOKEN_EXPIRES_IN,
//       path: '/'
//     })
//   } catch (error) {
//     if (
//       typeof error === 'object' &&
//       error !== null &&
//       'details' in error &&
//       typeof (error as unknown as { details?: { errors?: Record<string, string[]> } }).details === 'object'
//     ) {
//       const objectError = (error as unknown as { details?: { errors?: Record<string, string[]> } }).details?.errors as
//         | Record<string, string[]>
//         | undefined
//       if (objectError) {
//         for (const key in objectError) {
//           if (objectError[key]?.length) {
//             errors[key as keyof FormErrors] = objectError[key][0]
//           }
//         }
//         return { errors }
//       }
//     }

//     const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
//     return { formError: message }
//   }

//   redirect(URL.HOME)
// }

'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiClient } from './api-client'
import { BaseResponse } from '@/@types/base-response'
import { AuthResponse } from '@/@types/auth-response'
import URL from '@/constants/url'
import { CONFIG_ENV } from '@/constants/config.env'

// Tái định nghĩa type lỗi để sử dụng nhất quán
type FormErrors = Partial<{
  email: string
  password: string
  name: string
  confirmPassword: string
}>

// Type cho kết quả của Action
type ActionReturn = Promise<{ errors?: FormErrors; formError?: string }>

/**
 * @description Hàm xử lý việc thiết lập Access Token và Refresh Token vào cookies.
 * @param authData Dữ liệu phản hồi xác thực chứa tokens.
 */
async function setAuthCookies(authData: AuthResponse): Promise<void> {
  const cookieStore = await cookies() // Sử dụng cookies() trực tiếp

  const cookieOptions = {
    httpOnly: true,
    secure: CONFIG_ENV.NODE_ENV === 'production',
    path: '/'
  }

  // Set accessToken
  cookieStore.set('accessToken', authData.accessToken, {
    ...cookieOptions,
    maxAge: CONFIG_ENV.ACCESS_TOKEN_EXPIRES_IN
  })

  // Set refreshToken
  cookieStore.set('refreshToken', authData.refreshToken, {
    ...cookieOptions,
    maxAge: CONFIG_ENV.REFRESH_TOKEN_EXPIRES_IN
  })
}

/**
 * @description Xử lý logic chung sau khi gọi API xác thực thành công (set cookie và redirect).
 * @param authData Dữ liệu xác thực.
 */

// Định nghĩa cấu trúc lỗi chi tiết từ API để dễ dàng truy cập
type ApiErrorDetails = {
  details?: {
    errors?: Record<string, string[]>
  }
}

/**
 * @description Hàm tái sử dụng để xử lý lỗi từ cuộc gọi API, trích xuất lỗi validation.
 * @param error Đối tượng lỗi nhận được từ `catch`.
 * @returns Đối tượng chứa lỗi form chi tiết hoặc lỗi form chung.
 */
function handleApiError(error: unknown): { errors?: FormErrors; formError?: string } {
  // Kiểm tra nếu lỗi có cấu trúc chi tiết (thường là lỗi validation)
  const apiError = error as ApiErrorDetails | undefined

  if (
    typeof apiError === 'object' &&
    apiError !== null &&
    'details' in apiError &&
    typeof apiError.details?.errors === 'object'
  ) {
    const backendErrors = apiError.details.errors
    const errors: FormErrors = {}

    // Lặp qua các key lỗi từ backend và lấy lỗi đầu tiên
    for (const key in backendErrors) {
      if (backendErrors[key]?.length) {
        errors[key as keyof FormErrors] = backendErrors[key][0]
      }
    }

    if (Object.keys(errors).length > 0) {
      return { errors }
    }
  }

  // Xử lý lỗi chung (lỗi không xác định hoặc lỗi mạng/server)
  const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
  return { formError: message }
}

// -----------------------------------------------------------------------------
// ## Action Functions
// -----------------------------------------------------------------------------

export async function loginAction(formData: FormData): ActionReturn {
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const errors: FormErrors = {}

  // 1. Client-side Validation
  if (!email) errors.email = 'Email không được để trống'
  if (!password) errors.password = 'Mật khẩu không được để trống'
  if (Object.keys(errors).length > 0) return { errors }

  try {
    // 2. API Call
    const res = await apiClient.post<BaseResponse<AuthResponse>>('/auth/login', { email, password })

    // 3. Server-side Logic Error (e.g., wrong credentials)
    if (!res.success) {
      return { formError: res.message }
    }

    // 4. Success Handling (Set cookies and redirect)
    await setAuthCookies(res.data)
  } catch (error) {
    return handleApiError(error)
  }
  redirect(URL.HOME)
}

export async function registerAction(formData: FormData): ActionReturn {
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const name = formData.get('name')?.toString() ?? ''
  const confirmPassword = formData.get('confirmPassword')?.toString() ?? ''

  const errors: FormErrors = {}

  // 1. Client-side Validation
  if (!email) errors.email = 'Email không được để trống'
  if (!password) errors.password = 'Mật khẩu không được để trống'
  if (!name) errors.name = 'Username không được để trống'
  if (!confirmPassword) errors.confirmPassword = 'Xác nhận mật khẩu không được để trống'
  if (password !== confirmPassword) errors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu không khớp'
  if (Object.keys(errors).length > 0) return { errors }

  try {
    // 2. API Call
    const res = await apiClient.post<BaseResponse<AuthResponse>>('/auth/register', { email, password, name })

    // 3. Server-side Logic Error
    if (!res.success) {
      return { formError: res.message }
    }

    await setAuthCookies(res.data)
  } catch (error) {
    return handleApiError(error)
  }
  redirect(URL.HOME)
}
