import type {RoomRequest, RoomSearchRequest, RoomUserRequest} from "./RequestInterface";
import type {ApiResponse, BuildRoomResponse, DestroyRoomResponse, RoomSearchResponse} from "./ResponseInterface";
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

export const fetchSearchRoom = async (
    data: RoomSearchRequest,
    token?: string,
): Promise<ApiResponse<RoomSearchResponse>> => {
    return {
        traceId: "",
        code: 0,
        data: {
            rooms: [
                {
                    id: 1,
                    name: "Room 1",
                },
                {
                    id: 2,
                    name: "Room 2",
                }
            ]
        }
    }
    // return callFetch("http://127.0.0.1:8080/room/search", "POST", token, data)
}
