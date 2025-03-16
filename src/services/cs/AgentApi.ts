import { callFetch } from "../common";
import type { AgentCreateRequest, AgentUpdateRequest, AgentSearchRequest, CustomerTicketSearchRequest, AgentCustomerRequest, AgentDisableRequest, TicketTransferRequest, BindCustomerSearchRequest } from "./CsRequestInterface";
import type { AgentCreateResponse, AgentSearchResponse, CustomerBindResponse, CustomerSearchResponse, CustomerTicketSearchResponse, TicketSearchResponse, TicketTransferResponse } from "./CsResponseInterface";
import type { ApiResponse } from "../ResponseInterface";
import config from "../../app/config";
import { FakeSuccessResponse } from "../FakeSuccessResponse";


export const fetchCreateAgent = async (
  data: AgentCreateRequest,
  token?: string
): Promise<ApiResponse<AgentCreateResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      agentId: Math.random() * 1000,
      userId: Math.random() * 1000,
      isDisable: false,
      createdTime: new Date().toISOString(),
    })
    : callFetch("/agent/create", "POST", token, data);
};

export const fetchUpdateAgent = async (
  data: AgentUpdateRequest,
  token?: string
): Promise<ApiResponse<boolean>> => {
  return callFetch("/agent/update", "POST", token, data);
};

export const fetchDisableAgent = async (
  data: AgentDisableRequest,
  token?: string
): Promise<ApiResponse<boolean>> => {
  return config.useFake
    ? new FakeSuccessResponse(true)
    : callFetch("/agent/disable", "POST", token, data);
};

export const fetchSearchAgent = async (
  data: AgentSearchRequest,
  token?: string
): Promise<ApiResponse<AgentSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      agents: [
        {
          id: 1,
          userId: 1001,
          isDisable: false,
          isDefault: true,
          name: "Tom",
          department: "IT",
          createdTime: new Date().toISOString()
        },
        {
          id: 2,
          userId: 1002,
          isDisable: false,
          isDefault: false,
          name: "Gina",
          department: "IT",
          createdTime: new Date().toISOString()
        },
        {
          id: 3,
          userId: 1003,
          isDisable: true,
          isDefault: false,
          name: "Peter",
          department: "IT",
          createdTime: new Date().toISOString()
        }
      ],
    }) : callFetch("/agent/search", "POST", token, data);
};

export const fetchSearchBindCustomer = async (
  data: BindCustomerSearchRequest,
  token?: string
): Promise<ApiResponse<CustomerSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      customerInfos: [
        {
          agentUserId: 5001,
          customerUserId: 3001,
          name: "John Doe",
          roomId: 5001,
        },
        {
          agentUserId: 5002,
          customerUserId: 3002,
          name: "Jane Smith",
          roomId: 5002,
        }
      ],
    }) : callFetch("/agent/customer/search", "POST", token, data);
};

export const fetchSearchCustomerTicket = async (
  data: CustomerTicketSearchRequest,
  token?: string
): Promise<ApiResponse<CustomerTicketSearchResponse>> => {
  return callFetch("/agent/customer/ticket", "POST", token, data);
};

export const fetchSearchRecentTicket = async (
  token?: string
): Promise<ApiResponse<TicketSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      tickets: [
        {
          id: 1,
          name: "Technical Support",
          roomId: 101,
          agentUserId: 2001,
          customerUserId: 3001,
          isOpen: true,
          createdTime: "2025-03-11T10:15:30Z"
        },
        {
          id: 2,
          name: "Billing Inquiry",
          roomId: 102,
          agentUserId: 2002,
          customerUserId: 3002,
          isOpen: false,
          createdTime: "2025-03-10T14:45:00Z"
        }
      ],
    }) : callFetch("/agent/ticket", "GET", token);
};

export const fetchTransferTicket = async (
  data: TicketTransferRequest,
  token?: string
): Promise<ApiResponse<TicketTransferResponse>> => {
  return callFetch("/agent/ticket/transfer", "POST", token, data);
};

export const fetchBindCustomer = async (
  data: AgentCustomerRequest,
  token?: string
): Promise<ApiResponse<CustomerBindResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      agentCustomers: [
        {
          agentUserId: 5003,
          customerUserId: data.userIds[0],
          name: "John Smith",
          roomId: 5003,
        }
      ],
    }) : callFetch("/agent/customer/bind", "POST", token, data);
};

export const fetchUnbindCustomer = async (
  data: AgentCustomerRequest,
  token?: string
): Promise<ApiResponse<boolean>> => {
  return config.useFake
    ? new FakeSuccessResponse(true)
    : callFetch("/agent/customer/unbind", "POST", token, data);
};
