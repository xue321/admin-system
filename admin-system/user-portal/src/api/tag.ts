import request from './request'

export interface TagData {
  name: string
  color?: string
}

export function getTags() {
  return request.get('/portal/tags')
}

export function createTag(data: TagData) {
  return request.post('/portal/tags', data)
}

export function updateTag(id: number, data: TagData) {
  return request.put(`/portal/tags/${id}`, data)
}

export function deleteTag(id: number) {
  return request.delete(`/portal/tags/${id}`)
}

export function getQuestionTags(questionId: number) {
  return request.get(`/portal/tags/questions/${questionId}`)
}

export function setQuestionTags(questionId: number, tagIds: number[]) {
  return request.put(`/portal/tags/questions/${questionId}`, { tagIds })
}
