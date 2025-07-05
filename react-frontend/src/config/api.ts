// Import the dynamic API utility
import { API_BASE_URL } from '../utils/api';

export const API_CONFIG = {
  BASE_URL: `${API_BASE_URL}/api`,
  STATIC_URL: `${API_BASE_URL}/uploads`,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout',
      CHECK: '/auth/check-auth',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
      VERIFY_RESET_TOKEN: (token: string) => `/auth/verify-reset-token/${token}`,
      GOOGLE: '/auth/google',
      GOOGLE_CALLBACK: '/auth/google/callback',
      GITHUB: '/auth/github',
      GITHUB_CALLBACK: '/auth/github/callback'
    },
    ADMIN_AUTH: {
      LOGIN: '/admin/auth/login',
      REGISTER: '/admin/auth/register',
      REFRESH_TOKEN: '/admin/auth/refresh-token',
      LOGOUT: '/admin/auth/logout',
      CHECK: '/admin/auth/check-auth',
      FORGOT_PASSWORD: '/admin/auth/forgot-password',
      RESET_PASSWORD: (token: string) => `/admin/auth/reset-password/${token}`,
      VERIFY_RESET_TOKEN: (token: string) => `/admin/auth/verify-reset-token/${token}`
    },
    ADMIN: {
      REQUESTS: '/admin/requests',
      APPROVE: (id: string) => `/admin/approve/${id}`,
      REJECT: (id: string) => `/admin/reject/${id}`
    },
    PASSAGES: {
      BASE: '/passages',
      BY_TEST: (testType: string) => `/passages/test/${encodeURIComponent(testType)}`,
      BY_ID: (id: string) => `/passages/${id}`
    },
    DELETE_REQUESTS: {
      BASE: '/delete-requests',
      BY_ID: (id: string) => `/delete-requests/${id}`
    },
    USERS: {
      BASE: '/users'
    }
  }
}; 