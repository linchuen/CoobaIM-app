import type {
  FriendRemoveRequest,
  FriendRequest,
  FriendSearchRequest,
} from "./RequestInterface"
import type {
  ApiResponse,
  ApplyFriendResponse,
  FriendSearchResponse,
} from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"
import { FakeSuccessResponse } from "./FakeSuccessResponse"

export const fetchApplyFriend = async (
  data: FriendRequest,
  token?: string,
): Promise<ApiResponse<ApplyFriendResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({ applyId: 123 })
    : callFetch(config.apiUrl + "/friend/apply", "POST", token, data)
}

export const fetchPermitFriend = async (
  data: FriendRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return callFetch(config.apiUrl + "/friend/permit", "POST", token, data)
}

export const fetchRemoveFriend = async (
  data: FriendRemoveRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return callFetch(config.apiUrl + "/friend/remove", "DELETE", token, data)
}

export const fetchSearchFriend = async (
  data: FriendSearchRequest,
  token?: string,
): Promise<ApiResponse<FriendSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
        friends: [
          {
            id: 1,
            userId: 1,
            friendUserId: 2,
            showName: "Alice",
          },
          {
            id: 2,
            userId: 1,
            friendUserId: 3,
            showName: "Cat",
          },
        ],
      })
    : callFetch(config.apiUrl + "/friend/search", "POST", token, data)
}
