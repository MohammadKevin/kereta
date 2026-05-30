import axios from 'axios'

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://ukl-sistem-kereta-production.up.railway.app/api'

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem(
          'accessToken',
        )

      if (token) {
        config.headers =
          config.headers || {}

        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) =>
    Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(
        'Network Error:',
        error.message,
      )

      return Promise.reject(error)
    }

    console.group(
      '🚨 API ERROR',
    )

    console.error(
      'Status:',
      error.response.status,
    )

    console.error(
      'URL:',
      error.config?.url,
    )

    console.error(
      'Method:',
      error.config?.method,
    )

    console.error(
      'Response:',
      error.response.data,
    )

    console.groupEnd()

    return Promise.reject(error)
  },
)

export const setAccessToken = (
  token: string,
) => {
  localStorage.setItem(
    'accessToken',
    token,
  )
}

export const getAccessToken = () => {
  if (typeof window === 'undefined')
    return null

  return localStorage.getItem(
    'accessToken',
  )
}

export const removeAccessToken = () => {
  localStorage.removeItem(
    'accessToken',
  )

  localStorage.removeItem(
    'user',
  )
}

export default api