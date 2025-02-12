import type { FriendRemoveRequest, FriendRequest, FriendSearchRequest } from "./RequestInterface"
import type { ApiResponse, ApplyFriendResponse, FriendInfo, FriendSearchResponse } from "./ResponseInterface"
import { callFetch } from "./common";

export const fetchApplyFriend = async (
  data: FriendRequest,
  token?: string,
): Promise<ApiResponse<ApplyFriendResponse>> => {
  return callFetch("http://127.0.0.1:8080/friend/apply", "POST", token, data)
}

export const fetchPermitFriend = async (
  data: FriendRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return callFetch("http://127.0.0.1:8080/friend/permit", "POST", token, data)
}

export const fetchRemoveFriend = async (
  data: FriendRemoveRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return callFetch("http://127.0.0.1:8080/friend/remove", "DELETE", token, data)
}

export const fetchSearchFriend = async (
  data: FriendSearchRequest,
  token?: string,
): Promise<ApiResponse<FriendSearchResponse>> => {
  return {
    traceId: "",
    code: 0,
    data: {
      friends: [
        {
          id: 1,
          userId: 1,
          friendUserId: 1,
          showName: "Alice"
        },{
          id: 1,
          userId: 1,
          friendUserId: 1,
          showName: "Bob"
        }
      ]
    }
  }

  // return callFetch("http://127.0.0.1:8080/friend/search", "POST", token, data)
}
