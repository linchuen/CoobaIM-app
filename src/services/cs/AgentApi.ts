import { callFetch } from "../common";
import type { AgentCreateRequest, AgentUpdateRequest, AgentSearchRequest, CustomerTicketSearchRequest, AgentCustomerRequest, AgentDisableRequest, TicketTransferRequest } from "./CsRequestInterface";
import type { AgentCreateResponse, AgentSearchResponse, CustomerSearchResponse, CustomerTicketSearchResponse, TicketSearchResponse, TicketTransferResponse } from "./CsResponseInterface";
import type { ApiResponse } from "../ResponseInterface";


export const fetchCreateAgent = async (
  data: AgentCreateRequest,
  token?: string
): Promise<ApiResponse<AgentCreateResponse>> => {
  return callFetch("/agent/create", "POST", token, data);
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
  return callFetch("/agent/disable", "POST", token, data);
};

export const fetchSearchAgent = async (
  data: AgentSearchRequest,
  token?: string
): Promise<ApiResponse<AgentSearchResponse>> => {
  return callFetch("/agent/search", "POST", token, data);
};

export const fetchSearchCustomer = async (
  token?: string
): Promise<ApiResponse<CustomerSearchResponse>> => {
  return callFetch("/agent/customer/customer", "GET", token);
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
  return callFetch("/agent/ticket", "GET", token);
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
): Promise<ApiResponse<boolean>> => {
  return callFetch("/agent/customer/bind", "POST", token, data);
};

export const fetchUnbindCustomer = async (
  data: AgentCustomerRequest,
  token?: string
): Promise<ApiResponse<boolean>> => {
  return callFetch("/agent/customer/unbind", "POST", token, data);
};
