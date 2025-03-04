import {
  setErrorDialogOpen,
  setErrorMessage,
} from "../features/globalSlice"
import type { ApiResponse } from "./ResponseInterface"
import type { AppDispatch } from "../app/store"
import config from "../app/config"

export async function callFetch(
  url: string,
  method: "POST" | "PUT" | "DELETE" | "GET",
  token: string | undefined,
  data: any,
) {
  try {
    const body = JSON.stringify(data)
    const res = await fetch(config.apiUrl + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data === null ? null : body,
    })

    if (!res.ok) {
      console.error("fetch %s error %s", url, res.status)
      return {
        traceId: "99999",
        code: -1,
        errorMessage: res.status,
      }
    }
    const response = res.json()
    console.log("fetch %s body %s %s", url, body, response)
    return response;
  } catch (e: any) {
    console.error("fetch %s error %s", url, e.message)
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
