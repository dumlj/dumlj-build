export interface SseResponse<T = any> {
  code: number
  success: boolean
  data: T
}
