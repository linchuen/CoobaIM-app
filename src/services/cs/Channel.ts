import config from "../../app/config";
import { callFetch } from "../common";

import { FakeSuccessResponse } from "../FakeSuccessResponse";
import type { ApiResponse } from "../ResponseInterface";
import type { ChannelCreateRequest, ChannelDeleteRequest, ChannelUpdateRequest } from "./CsRequestInterface";
import type { ChannelCreateResponse, ChannelDeleteResponse, ChannelSearchResponse } from "./CsResponseInterface";


export const fetchCreateChannel = async (
  data: ChannelCreateRequest,
  token?: string
): Promise<ApiResponse<ChannelCreateResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      channelId: Math.floor(Math.random() * 100) + 1
    })
    : callFetch("/channel/create", "POST", token, data);
};

export const fetchUpdateChannel = async (
  data: ChannelUpdateRequest,
  token?: string
): Promise<ApiResponse<boolean>> => {
  return config.useFake
    ? new FakeSuccessResponse(true)
    : callFetch("/channel/update", "POST", token, data);
};

export const fetchDeleteChannel = async (
  data: ChannelDeleteRequest,
  token?: string
): Promise<ApiResponse<ChannelDeleteResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      channelId: data.channelId
    })
    : callFetch("/channel/delete", "DELETE", token, data);
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
          isPublic: true,
          createdTime: "2025-03-10T14:45:00Z"
        },
        {
          id: 2,
          name: "會員客服",
          isPublic: false,
          createdTime: "2025-03-10T14:45:00Z"
        },
      ],
    })
    : callFetch("/channel/search", "GET", token);
};
