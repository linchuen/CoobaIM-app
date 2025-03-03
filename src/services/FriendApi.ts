import type {
  FriendRemoveRequest,
  FriendRequest,
  FriendSearchRequest,
} from "./RequestInterface"
import type {
  ApiResponse,
  ApplyFriendResponse,
  FriendApplySearchResponse,
  FriendSearchResponse,
  PermitFriendResponse,
} from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"
import { FakeSuccessResponse } from "./FakeSuccessResponse"

export const fetchApplyFriend = async (
  data: FriendRequest,
  token: string,
): Promise<ApiResponse<ApplyFriendResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({ applyId: 123 })
    : callFetch("/friend/apply", "POST", token, data)
}

export const fetchPermitFriend = async (
  data: FriendRequest,
  token: string,
): Promise<ApiResponse<PermitFriendResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({ roomId: 456 })
    : callFetch("/friend/permit", "POST", token, data)
}

export const fetchRemoveFriend = async (
  data: FriendRemoveRequest,
  token: string,
): Promise<ApiResponse<boolean>> => {
  return callFetch("/friend/remove", "DELETE", token, data)
}

export const fetchSearchFriend = async (
  data: FriendSearchRequest,
  token: string,
): Promise<ApiResponse<FriendSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      friends: [
        {
          id: 1,
          userId: 1,
          friendUserId: 2,
          showName: "Alice",
          roomId: 10
        },
        {
          id: 2,
          userId: 1,
          friendUserId: 3,
          showName: "Cat",
          roomId: 11
        },
      ],
    })
    : callFetch("/friend/search", "POST", token, data)
}

export const fetchSearchFriendApply = async (
  data?: null,
  token?: string,
): Promise<ApiResponse<FriendApplySearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      applicants: [
        {
          id: 1,
          applyUserId: 4,
          name: "Tom",
        },
      ],
    })
    : callFetch("/friend/apply/search", "POST", token, data)
}
