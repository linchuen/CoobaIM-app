import type {RoomRequest, RoomUserRequest} from "./RequestInterface";
import type {ApiResponse, BuildRoomResponse, DestroyRoomResponse} from "./ResponseInterface";
import {callFetch} from "./common";

export const fetchBuildRoom = async (
    data: RoomRequest,
    token?: string,
): Promise<ApiResponse<BuildRoomResponse>> => {
    return callFetch("http://127.0.0.1:8080/room/build", "POST", token, data)
}

export const fetchDestroyRoom = async (
    data: RoomRequest,
    token?: string,
): Promise<ApiResponse<DestroyRoomResponse>> => {
    return callFetch("http://127.0.0.1:8080/room/destroy", "DELETE", token, data)
}

export const fetchInviteUser = async (
    data: RoomUserRequest,
    token?: string,
): Promise<ApiResponse<boolean>> => {
    return callFetch("http://127.0.0.1:8080/room/invite", "POST", token, data)
}

export const fetchEvictUser = async (
    data: RoomUserRequest,
    token?: string,
): Promise<ApiResponse<boolean>> => {
    return callFetch("http://127.0.0.1:8080/room/evict", "DELETE", token, data)
}
