import request from './request'

export function getUsers(params: { page: number; size: number; username?: string }) {
  return request.get('/users', { params })
}

export function createUser(data: Record<string, unknown>) {
  return request.post('/users', data)
}

export function updateUser(id: number, data: Record<string, unknown>) {
  return request.put(`/users/${id}`, data)
}

export function deleteUser(id: number) {
  return request.delete(`/users/${id}`)
}

export function getRoles() {
  return request.get('/roles')
}

export function createRole(data: Record<string, unknown>) {
  return request.post('/roles', data)
}

export function updateRole(id: number, data: Record<string, unknown>) {
  return request.put(`/roles/${id}`, data)
}

export function deleteRole(id: number) {
  return request.delete(`/roles/${id}`)
}

export function getLogs(params: { page: number; size: number; username?: string }) {
  return request.get('/logs', { params })
}
