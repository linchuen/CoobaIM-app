import type { SpeakRequest } from "./RequestInterface"
import type { ApiResponse } from "./ResponseInterface"

const getAuthHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

export const fetchSpeakToUser = async (
  data: SpeakRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  const res = await fetch(
    `http://127.0.0.1:8080/speak/user`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    },
  )

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }

  return res.json()
}

export const fetchSpeakToRoom = async (
  data: SpeakRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  const res = await fetch(
    `http://127.0.0.1:8080/speak/room`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    },
  )

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }

  return res.json()
}

export const fetchSpeakToAll = async (
  data: SpeakRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  const res = await fetch(
    `http://127.0.0.1:8080/speak/all`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    },
  )

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }

  return res.json()
}
