import {ChatLoadRequest, SpeakRequest} from "./RequestInterface"
import type { ApiResponse } from "./ResponseInterface"
import {callFetch} from "./common";

export const fetchSpeakToUser = async (
    data: SpeakRequest,
    token?: string,
): Promise<ApiResponse<boolean>> => {
    return callFetch("http://127.0.0.1:8080/chat/user", "POST", token, data)
}

export const fetchSpeakToRoom = async (
    data: SpeakRequest,
    token?: string,
): Promise<ApiResponse<boolean>> => {
    return callFetch("http://127.0.0.1:8080/chat/room", "POST", token, data)
}

export const fetchSpeakToAll = async (
    data: SpeakRequest,
    token?: string,
): Promise<ApiResponse<boolean>> => {
    return callFetch("http://127.0.0.1:8080/chat/all", "POST", token, data)
}

export const fetchChatLoad = async (
    data: ChatLoadRequest,
    token?: string,
): Promise<ApiResponse<boolean>> => {
    return callFetch("http://127.0.0.1:8080/chat/load", "POST", token, data)
}
