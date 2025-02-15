import type {ChatLoadRequest, SpeakRequest} from "./RequestInterface"
import type {ApiResponse, ChatLoadResponse} from "./ResponseInterface"
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

export const fetchLoadChat = async (
    data: ChatLoadRequest,
    token?: string,
): Promise<ApiResponse<ChatLoadResponse>> => {
    return {
        traceId: "",
        code: 0,
        data: {
            chats: [
                {
                    id: 1,
                    userId: 2,
                    name: "Alice",
                    roomId: 1,
                    message: "今天天氣很好，要不要一起去公園走走？",
                    type: "text",
                },
                {
                    id: 1,
                    userId: 1,
                    name: "Bob",
                    roomId: 1,
                    message: "好啊，順便買杯咖啡帶著！",
                    type: "text",
                },
                {
                    id: 1,
                    userId: 2,
                    name: "Alice",
                    roomId: 1,
                    message: "不錯的主意，我請客。",
                    type: "text",
                },
                {
                    id: 1,
                    userId: 1,
                    name: "Bob",
                    roomId: 1,
                    message: "那我可就不客氣了！",
                    type: "text",
                },
            ]
        }
    }
    // return callFetch("http://127.0.0.1:8080/chat/load", "POST", token, data)
}
