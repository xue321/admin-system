import { create } from 'zustand'

interface AuthState {
  token: string | null
  username: string | null
  nickname: string | null
  permissions: string[]
  setAuth: (data: { token: string; username: string; nickname: string; permissions: string[] }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  nickname: localStorage.getItem('nickname'),
  permissions: JSON.parse(localStorage.getItem('permissions') || '[]'),
  setAuth: (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('nickname', data.nickname)
    localStorage.setItem('permissions', JSON.stringify(data.permissions))
    set(data)
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('nickname')
    localStorage.removeItem('permissions')
    set({ token: null, username: null, nickname: null, permissions: [] })
  },
}))
