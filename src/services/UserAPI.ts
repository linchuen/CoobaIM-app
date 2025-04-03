import type { LoginRequest, RefreshRequest, RegisterRequest } from "./RequestInterface"
import type {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  UserDetailResponse,
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
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8vUnmnpz4XsDeqVMAa6bL0dUxqV3wdPwB6w&s",
      loginTime: "string",
      expireTime: "string",
    })
    : callFetch("/user/login", "POST", undefined, data)
}

export const fetchFreshToken = async (
  data: RefreshRequest,
  token?: string,
): Promise<ApiResponse<LoginResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      userId: 1,
      name: "Bob",
      token: "token",
      role: config.testRole,
      platform: "PC",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8vUnmnpz4XsDeqVMAa6bL0dUxqV3wdPwB6w&s",
      loginTime: "string",
      expireTime: "string",
    })
    : callFetch("/user/refresh", "POST", token, data)
}

export const fetchUserDetail = async (
  token?: string,
): Promise<ApiResponse<UserDetailResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      userDetail: {
        id: 1,
        userId: 1,
        email: "Bob@cooba.com",
        name: "Bob",
        tags: "[GameMaster]",
        remark: "Cooba member",
        createdTime: new Date().toISOString(),
      }
    })
    : callFetch("/user/detail", "GET", token)
}
