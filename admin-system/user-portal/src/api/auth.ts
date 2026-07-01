import request from './request'

export function login(data: { username: string; password: string }) {
  return request.post('/portal/auth/login', data)
}
