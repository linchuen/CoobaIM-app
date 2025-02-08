export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  traceId: string
  code: number
  errorMessage?: string
  data?: T
}

export const fetchRegister = async (
  data: RegisterData,
): Promise<ApiResponse<any>> => {
  const res = await fetch("http://127.0.0.1:8080/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }

  return res.json() // 直接
}
