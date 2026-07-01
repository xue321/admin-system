import request from './request'

export interface QuestionQuery {
  categoryId?: number
  status?: number
  colorTag?: string
  keyword?: string
  tagId?: number
  page?: number
  size?: number
}

export interface QuestionData {
  categoryId: number
  title: string
  content?: string
  myAnswer?: string
  correctAnswer?: string
  note?: string
  colorTag?: string
  status?: number
  strikethrough?: number
}

export function getQuestions(params: QuestionQuery) {
  return request.get('/portal/questions', { params })
}

export function getQuestion(id: number) {
  return request.get(`/portal/questions/${id}`)
}

export function createQuestion(data: QuestionData) {
  return request.post('/portal/questions', data)
}

export function updateQuestion(id: number, data: QuestionData) {
  return request.put(`/portal/questions/${id}`, data)
}

export function deleteQuestion(id: number) {
  return request.delete(`/portal/questions/${id}`)
}

export function updateQuestionStatus(id: number, data: { status?: number; colorTag?: string; strikethrough?: number; reviewCount?: number }) {
  return request.put(`/portal/questions/${id}/status`, data)
}

export function markReviewed(id: number, quality?: number) {
  return request.put(`/portal/questions/${id}/review`, { quality: quality ?? 4 })
}

export function getDueReview() {
  return request.get('/portal/questions/due-review')
}

export function getStatistics() {
  return request.get('/portal/questions/statistics')
}

export function getChartData(days: number = 30) {
  return request.get('/portal/questions/chart-data', { params: { days } })
}
