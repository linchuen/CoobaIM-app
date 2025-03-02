import type { ChatLoadRequest } from "./RequestInterface"
import type { ApiResponse, ChatLoadResponse } from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"
import { FakeSuccessResponse } from "./FakeSuccessResponse"

export const fetchLoadChat = async (
  data: ChatLoadRequest,
  token?: string,
): Promise<ApiResponse<ChatLoadResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
        chats: [
          {
            id: 1,
            userId: 2,
            name: "Alice",
            roomId: 1,
            message: "今天天氣很好，要不要一起去公園走走？",
            type: "TEXT",
          },
          {
            id: 2,
            userId: 1,
            name: "Bob",
            roomId: 1,
            message: "好啊，順便買杯咖啡帶著！",
            type: "TEXT",
          },
          {
            id: 3,
            userId: 2,
            name: "Alice",
            roomId: 1,
            message: "不錯的主意，我請客。",
            type: "TEXT",
          },
          {
            id: 4,
            userId: 1,
            name: "Bob",
            roomId: 1,
            message: "那我可就不客氣了！",
            type: "TEXT",
          },
        ],
      })
    : callFetch("/chat/load", "POST", token, data)
}
