import type {RoomRequest, RoomUserRequest} from "./RequestInterface";
import type {ApiResponse, BuildRoomResponse, DestroyRoomResponse} from "./ResponseInterface";


const getAuthHeaders = (token?: string) => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const fetchBuildRoom = async (
    data: RoomRequest,
    token?: string
): Promise<ApiResponse<BuildRoomResponse>> => {
    const res = await fetch(`http://127.0.0.1:8080/room/build`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
};

export const fetchDestroyRoom = async (
    data: RoomRequest,
    token?: string
): Promise<ApiResponse<DestroyRoomResponse>> => {
    const res = await fetch(`http://127.0.0.1:8080/room/destroy`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
};

export const fetchInviteUser = async (
    data: RoomUserRequest,
    token?: string
): Promise<ApiResponse<boolean>> => {
    const res = await fetch(`http://127.0.0.1:8080/room/invite`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
};

export const fetchEvictUser = async (
    data: RoomUserRequest,
    token?: string
): Promise<ApiResponse<boolean>> => {
    const res = await fetch(`http://127.0.0.1:8080/room/evict`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
};