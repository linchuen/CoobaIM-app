import type { FriendRemoveRequest, FriendRequest } from "./RequestInterface"
import type { ApiResponse, ApplyFriendResponse } from "./ResponseInterface"
import {callFetch} from "./common";

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
