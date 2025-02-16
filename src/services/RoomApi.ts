import type {
  RoomRequest,
  RoomSearchRequest,
  RoomUserRequest,
} from "./RequestInterface"
import type {
  ApiResponse,
  BuildRoomResponse,
  DestroyRoomResponse,
  RoomSearchResponse,
} from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"
import {FakeSuccessResponse} from "./FakeSuccessResponse";

export const fetchBuildRoom = async (
  data: RoomRequest,
  token?: string,
): Promise<ApiResponse<BuildRoomResponse>> => {
  return config.useFake
      ? new FakeSuccessResponse({
          name: "Room 3",
      })
      : callFetch(config.apiUrl + "/room/build", "POST", token, data)
}

export const fetchDestroyRoom = async (
  data: RoomRequest,
  token?: string,
): Promise<ApiResponse<DestroyRoomResponse>> => {
  return callFetch(config.apiUrl + "/room/destroy", "DELETE", token, data)
}

export const fetchInviteUser = async (
  data: RoomUserRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return callFetch(config.apiUrl + "/room/invite", "POST", token, data)
}

export const fetchEvictUser = async (
  data: RoomUserRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return callFetch(config.apiUrl + "/room/evict", "DELETE", token, data)
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
    : callFetch(config.apiUrl + "/room/search", "POST", token, data)
}
