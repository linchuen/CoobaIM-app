import { callFetch } from "./common";
import type { CustomerEnterRequest } from "./CsRequestInterface";
import type { CustomerEnterResponse } from "./CsResponseInterface";
import type { RegisterRequest } from "./RequestInterface";
import type { ApiResponse, RegisterResponse, LoginResponse } from "./ResponseInterface";


export const fetchCreateUser = async (
  data: RegisterRequest,
  token?: string
): Promise<ApiResponse<RegisterResponse>> => {
  return callFetch("/customer/create", "POST", token, data);
};

export const fetchEnterRoom = async (
  data: CustomerEnterRequest,
  token?: string
): Promise<ApiResponse<CustomerEnterResponse>> => {
  return callFetch("/customer/enter", "POST", token, data);
};

export const fetchCreateGuest = async (
  id: number,
  token?: string
): Promise<ApiResponse<boolean>> => {
  return callFetch(`/customer/guest/${id}`, "POST", token);
};

export const fetchGuestToken = async (
  token?: string
): Promise<ApiResponse<LoginResponse>> => {
  return callFetch("/customer/guest", "GET", token);
};
