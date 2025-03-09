import { callFetch } from "./common";
import type { ChannelCreateRequest, ChannelDeleteRequest } from "./CsRequestInterface";
import type { ChannelCreateResponse, ChannelSearchResponse } from "./CsResponseInterface";
import type { ApiResponse } from "./ResponseInterface";


export const fetchCreateChannel = async (
  data: ChannelCreateRequest,
  token?: string
): Promise<ApiResponse<ChannelCreateResponse>> => {
  return callFetch("/channel/create", "POST", token, data);
};

export const fetchDeleteChannel = async (
  data: ChannelDeleteRequest,
  token?: string
): Promise<ApiResponse<boolean>> => {
  return callFetch("/channel/delete", "DELETE", token, data);
};

export const fetchSearchChannel = async (
  token?: string
): Promise<ApiResponse<ChannelSearchResponse>> => {
  return callFetch("/channel/search", "GET", token);
};
