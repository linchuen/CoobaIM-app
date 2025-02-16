import type { ApiResponse } from "./ResponseInterface"

export class FakeSuccessResponse<T> implements ApiResponse<T> {
  code: number
  traceId: string
  data: T

  constructor(data: T) {
    this.code = 0
    this.traceId = ""
    this.data = data
  }
}
