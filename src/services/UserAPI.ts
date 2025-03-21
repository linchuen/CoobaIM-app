import type { LoginRequest, RegisterRequest } from "./RequestInterface"
import type {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
} from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"
import { FakeSuccessResponse } from "./FakeSuccessResponse"

export const fetchRegisterUser = async (
  data: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> => {
  return callFetch("/user/register", "POST", undefined, data)
}

export const fetchLogin = async (
  data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
        userId: 1,
        name: "Bob",
        token: "token",
        role: config.testRole,
        platform: "PC",
        loginTime: "string",
        expireTime: "string",
      })
    : callFetch("/user/login", "POST", undefined, data)
}
