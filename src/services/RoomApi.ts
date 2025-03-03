import type {
  RoomRequest,
  RoomSearchRequest,
  RoomUserRequest,
} from "./RequestInterface"
import type {
  ApiResponse,
  BuildRoomResponse,
  DestroyRoomResponse,
  RoomMemberResponse,
  RoomSearchResponse,
} from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"
import { FakeSuccessResponse } from "./FakeSuccessResponse";

export const fetchBuildRoom = async (
  data: RoomRequest,
  token?: string,
): Promise<ApiResponse<BuildRoomResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      name: "Room 3",
    })
    : callFetch("/room/build", "POST", token, data)
}

export const fetchDestroyRoom = async (
  data: RoomRequest,
  token?: string,
): Promise<ApiResponse<DestroyRoomResponse>> => {
  return callFetch("/room/destroy", "DELETE", token, data)
}

export const fetchInviteUser = async (
  data: RoomUserRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return config.useFake
    ? new FakeSuccessResponse(true)
    : callFetch("/room/invite", "POST", token, data)
}

export const fetchEvictUser = async (
  data: RoomUserRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return config.useFake
    ? new FakeSuccessResponse(true)
    : callFetch("/room/evict", "DELETE", token, data)
}

export const fetchSearchRoom = async (
  data: RoomSearchRequest,
  token?: string,
): Promise<ApiResponse<RoomSearchResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      rooms: [
        {
          id: 1,
          name: "Room 1",
        },
        {
          id: 2,
          name: "Room 2",
        },
      ],
    })
    : callFetch("/room/search", "POST", token, data)
}

export const fetchSearchRoomUsers = async (
  data: RoomRequest,
  token?: string,
): Promise<ApiResponse<RoomMemberResponse>> => {
  return config.useFake
  ? new FakeSuccessResponse({
    roomUsers: [
      {
        id: 1,
        roomId: 1,
        userId: 2,
        showName: "Alice"
      },
    ],
  })
  :callFetch("/room/search/users", "POST", token, data)
}
