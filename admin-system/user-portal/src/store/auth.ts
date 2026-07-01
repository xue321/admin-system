import { create } from 'zustand'

interface AuthState {
  token: string | null
  username: string | null
  nickname: string | null
  setAuth: (data: { token: string; username: string; nickname: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('portal_token'),
  username: localStorage.getItem('portal_username'),
  nickname: localStorage.getItem('portal_nickname'),
  setAuth: (data) => {
    localStorage.setItem('portal_token', data.token)
    localStorage.setItem('portal_username', data.username)
    localStorage.setItem('portal_nickname', data.nickname)
    set({ token: data.token, username: data.username, nickname: data.nickname })
  },
  logout: () => {
    localStorage.removeItem('portal_token')
    localStorage.removeItem('portal_username')
    localStorage.removeItem('portal_nickname')
    set({ token: null, username: null, nickname: null })
  },
}))
