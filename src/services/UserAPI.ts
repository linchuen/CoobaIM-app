import type {LoginRequest, RegisterRequest} from "./RequestInterface"
import type {ApiResponse, LoginResponse, RegisterResponse} from "./ResponseInterface"
import {callFetch} from "./common";

export const fetchRegisterUser = async (
    data: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> => {
  return callFetch("http://127.0.0.1:8080/user/register", "POST", undefined, data)
}

export const fetchLogin = async (
    data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  return {
    traceId: "",
    code: 0,
    data: {
      userId: 1,
      token: "token",
      platform: "PC",
      loginTime: "string",
      expireTime: "string"
    }
  }
  // return callFetch("http://127.0.0.1:8080/user/login", "POST", undefined, data)
}
