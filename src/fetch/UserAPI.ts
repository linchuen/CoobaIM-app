import type {LoginRequest, RegisterRequest} from "./RequestInterface"
import type {ApiResponse, LoginResponse, RegisterResponse} from "./ResponseInterface"

const getAuthHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const fetchRegisterUser = async (
    data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> => {
  const res = await fetch("http://127.0.0.1:8080/user/register", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  return res.json();
};

export const fetchLogin = async (
    data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const res = await fetch("http://127.0.0.1:8080/user/login", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  return res.json();
};