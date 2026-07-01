import request from './request'

export function getMindMaps() {
  return request.get('/portal/mindmaps')
}

export function getMindMap(id: number) {
  return request.get(`/portal/mindmaps/${id}`)
}

export function createMindMap(data: { title: string; data?: string }) {
  return request.post('/portal/mindmaps', data)
}

export function updateMindMap(id: number, data: { title?: string; data?: string }) {
  return request.put(`/portal/mindmaps/${id}`, data)
}

export function deleteMindMap(id: number) {
  return request.delete(`/portal/mindmaps/${id}`)
}
