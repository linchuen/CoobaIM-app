import type { ChatLoadRequest, SpeakRequest } from "./RequestInterface"
import type { ApiResponse, ChatLoadResponse } from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"

export const fetchSpeakToUser = async (
  data: SpeakRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return config.useFake
      ? true
      :  callFetch(config.apiUrl + "/chat/user", "POST", token, data)
}

export const fetchSpeakToRoom = async (
  data: SpeakRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return config.useFake
    ? true
    : callFetch(config.apiUrl + "/chat/room", "POST", token, data)
}

export const fetchSpeakToAll = async (
  data: SpeakRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return config.useFake
      ? true
      :  callFetch(config.apiUrl + "/chat/all", "POST", token, data)
}

export const fetchLoadChat = async (
  data: ChatLoadRequest,
  token?: string,
): Promise<ApiResponse<ChatLoadResponse>> => {
  return config.useFake
    ? {
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
              id: 2,
              userId: 1,
              name: "Bob",
              roomId: 1,
              message: "好啊，順便買杯咖啡帶著！",
              type: "text",
            },
            {
              id: 3,
              userId: 2,
              name: "Alice",
              roomId: 1,
              message: "不錯的主意，我請客。",
              type: "text",
            },
            {
              id: 4,
              userId: 1,
              name: "Bob",
              roomId: 1,
              message: "那我可就不客氣了！",
              type: "text",
            },
          ],
        },
      }
    : callFetch(config.apiUrl + "/chat/load", "POST", token, data)
}
