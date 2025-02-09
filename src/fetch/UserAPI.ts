import type { ApiResponse, RegisterRequest } from "./DtoInterface"

export const fetchRegister = async (
  data: RegisterRequest,
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
