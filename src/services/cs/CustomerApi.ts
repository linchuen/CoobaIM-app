import config from "../../app/config";
import { callFetch } from "../common";
import { FakeSuccessResponse } from "../FakeSuccessResponse";
import { v4 as uuidv4 } from 'uuid';
import type { CustomerEnterRequest } from "./CsRequestInterface";
import type { CustomerAgentSearchResponse, CustomerEnterResponse } from "./CsResponseInterface";
import type { RegisterRequest } from "../RequestInterface";
import type { ApiResponse, RegisterResponse, LoginResponse } from "../ResponseInterface";


export const fetchCreateUser = async (
  data: RegisterRequest,
  token?: string
): Promise<ApiResponse<RegisterResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      userId: 123
    })
    : callFetch("/customer/create", "POST", token, data);
};

export const fetchEnterRoom = async (
  data: CustomerEnterRequest,
  token?: string
): Promise<ApiResponse<CustomerEnterResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      ticket: {
        id: Math.random() * 1000,
        name: uuidv4(),
        roomId: Math.random() * 1000,
        agentUserId: Math.random() * 1000,
        customerUserId: Math.random() * 1000,
        isOpen: true,
        createdTime: new Date().toISOString(),
      }
    })
    : callFetch("/customer/enter", "POST", token, data);
};

export const fetchSearchAgent = async (
  token?: string
): Promise<ApiResponse<CustomerAgentSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      agentInfos: [
        {
          agentId: 1,
          agentUserId: 101,
          roomId: 1001,
          name: "Alice",
          department: "Sales"
        },
        {
          agentId: 2,
          agentUserId: 102,
          roomId: 1002,
          name: "Bob",
          department: "Support"
        }
      ]
    })
    : callFetch("/customer/agent/search", "GET", token);
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
