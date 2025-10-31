import { CONFIG_ENV } from '@/constants/config.env'

export interface FetchJsonOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined | null>
  params?: Record<string, string | number | boolean | undefined | null>
}

export class HttpError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.details = details
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)

  if (!res.ok) {
    let details: unknown
    try {
      details = await res.json()
    } catch {
      details = await res.text()
    }

    const message =
      typeof details === 'object' && details && 'message' in details
        ? String((details as Record<string, unknown>).message)
        : `Request failed: ${res.status}`

    throw new HttpError(res.status, message, details)
  }

  return (await res.json()) as T
}

export class ApiClient {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined | null>): string {
    const url = new URL(`${this.baseUrl}${path}`)
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      }
    }
    return url.toString()
  }

  private interpolate(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    if (!params) return path
    return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key: string) => {
      const value = params[key]
      if (value === undefined || value === null) throw new Error(`Missing route param: ${key}`)
      return encodeURIComponent(String(value))
    })
  }

  private async request<T>(path: string, options: FetchJsonOptions = {}): Promise<T> {
    const { query, params, ...rest } = options
    const finalUrl = this.buildUrl(this.interpolate(path, params), query)
    return fetchJson<T>(finalUrl, rest)
  }

  get<T>(path: string, options?: FetchJsonOptions) {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  post<T, B = unknown>(path: string, body?: B, options?: FetchJsonOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {})
      }
    })
  }

  put<T, B = unknown>(path: string, body?: B, options?: FetchJsonOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {})
      }
    })
  }

  delete<T>(path: string, options?: FetchJsonOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(CONFIG_ENV.BE_URL)
