import request from './request'

export function getCategoryTree() {
  return request.get('/portal/categories')
}

export function createCategory(data: { name: string; parentId?: number; sort?: number }) {
  return request.post('/portal/categories', data)
}

export function updateCategory(id: number, data: { name: string; parentId?: number; sort?: number }) {
  return request.put(`/portal/categories/${id}`, data)
}

export function deleteCategory(id: number) {
  return request.delete(`/portal/categories/${id}`)
}

export function getMindMapData() {
  return request.get('/portal/categories/mind-map-data')
}
