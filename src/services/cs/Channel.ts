import config from "../../app/config";
import { callFetch } from "../common";

import { FakeSuccessResponse } from "../FakeSuccessResponse";
import type { ApiResponse } from "../ResponseInterface";
import type { ChannelCreateRequest, ChannelDeleteRequest } from "./CsRequestInterface";
import type { ChannelCreateResponse, ChannelDeleteResponse, ChannelSearchResponse } from "./CsResponseInterface";


export const fetchCreateChannel = async (
  data: ChannelCreateRequest,
  token?: string
): Promise<ApiResponse<ChannelCreateResponse>> => {
  return callFetch("/channel/create", "POST", token, data);
};

export const fetchDeleteChannel = async (
  data: ChannelDeleteRequest,
  token?: string
): Promise<ApiResponse<ChannelDeleteResponse>> => {
  return callFetch("/channel/delete", "DELETE", token, data);
};

export const fetchSearchChannel = async (
  token?: string
): Promise<ApiResponse<ChannelSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      channels: [
        {
          id: 1,
          name: "24h客服",
          isPublic: true
        },
        {
          id: 2,
          name: "會員客服",
          isPublic: false
        },
      ],
    })
    : callFetch("/channel/search", "GET", token);
};
