import {
  setErrorDialogOpen,
  setErrorMessage,
} from "../features/common/globalSlice"
import type { ApiResponse } from "./ResponseInterface"
import type { AppDispatch } from "../app/store"

export async function callFetch(
  url: string,
  method: "POST" | "PUT" | "DELETE" | "GET",
  token: string | undefined,
  data: any,
) {
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    return res.json()
  } catch (e: any) {
    return {
      traceId: "99999",
      code: -1,
      errorMessage: e.message,
    }
  }
}

export async function handleFetch<T>(
  dispatch: AppDispatch,
  fetchFunction: Promise<ApiResponse<T>>,
  successCallback: (data: T) => void,
) {
  const apiResponse = await fetchFunction
  if (apiResponse.code !== 0) {
    dispatch(setErrorMessage(apiResponse.errorMessage || "unknown error"))
    dispatch(setErrorDialogOpen(true))
    return
  }

  if (!apiResponse.data) {
    throw new Error("response data is missing.")
  }
  dispatch(setErrorDialogOpen(false))

  const data = apiResponse.data
  successCallback(data)
}
