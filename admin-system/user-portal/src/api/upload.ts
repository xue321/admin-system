import request from './request'

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/portal/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
