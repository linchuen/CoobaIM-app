import {FriendRemoveRequest, FriendRequest} from "./RequestInterface";
import {ApiResponse, ApplyFriendResponse} from "./ResponseInterface";

const getAuthHeaders = (token?: string) => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const fetchApplyFriend = async (
    data: FriendRequest,
    token?: string
): Promise<ApiResponse<ApplyFriendResponse>> => {
    const res = await fetch("http://127.0.0.1:8080/friend/apply", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
};

export const fetchPermitFriend = async (
    data: FriendRequest,
    token?: string
): Promise<ApiResponse<boolean>> => {
    const res = await fetch("http://127.0.0.1:8080/friend/permit", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
};

export const fetchRemoveFriend = async (
    data: FriendRemoveRequest,
    token?: string
): Promise<ApiResponse<boolean>> => {
    const res = await fetch("http://127.0.0.1:8080/friend/remove", {
        method: "DELETE",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
};