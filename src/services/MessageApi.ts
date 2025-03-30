import type { ChatIsReadRequest, ChatLoadLastAndUnReadRequest, ChatLoadRequest } from "./RequestInterface"
import type { ApiResponse, ChatLoadLastAndUnReadResponse, ChatLoadResponse } from "./ResponseInterface"
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
          "id": 1,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "你有用過 React 嗎？我最近在學習它的 Hooks。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:00:00Z"
        },
        {
          "id": 2,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "當然，Hooks 很好用，尤其是 useState 和 useEffect。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:01:10Z"
        },
        {
          "id": 3,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "useEffect 在什麼情境下應該用？有時候覺得很難掌握。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:02:45Z"
        },
        {
          "id": 4,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "主要用來處理副作用，比如 API 請求、訂閱事件或 DOM 操作。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:03:30Z"
        },
        {
          "id": 5,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 useEffect 和 useLayoutEffect 的比較圖，或許能幫助理解。",
          "type": "IMAGE",
          "url": "https://storage.googleapis.com/zenn-user-upload/fb997d4dae09-20220216.png",
          "createdTime": "2025-03-30T09:04:50Z"
        },
        {
          "id": 6,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "這張圖不錯！有時候 useEffect 和 useLayoutEffect 讓我搞混。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:06:00Z"
        },
        {
          "id": 7,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "我找到一張 Redux 和 Zustand 的比較圖，應該有幫助！",
          "type": "IMAGE",
          "url": "https://storage.googleapis.com/zenn-user-upload/7cc2ba94bae7-20220216.png",
          "createdTime": "2025-03-30T09:07:30Z"
        },
        {
          "id": 8,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "感謝！Redux 似乎比較適合大型應用。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:08:10Z"
        },
        {
          "id": 9,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "沒錯，那後端開發你比較推薦 Node.js 還是 Python？",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:09:20Z"
        },
        {
          "id": 10,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "看需求，如果要做 API 服務，Node.js 很適合，機器學習相關的話 Python 更強。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:10:30Z"
        },
        {
          "id": 11,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 Node.js 和 Python 的性能比較圖，看看哪個更符合你的需求。",
          "type": "IMAGE",
          "url": "https://blog.webcodegenie.com/Node.js-vs-Python-Pros-and-Cons-for-Backend-Development-2048x1365.jpg",
          "createdTime": "2025-03-30T09:11:45Z"
        },
        {
          "id": 12,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "確實，Node.js 的 I/O 性能很強，適合高並發應用。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:13:00Z"
        },
        {
          "id": 13,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "如果用 Node.js，Express 和 NestJS 你會怎麼選？",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:14:10Z"
        },
        {
          "id": 14,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "Express 簡單靈活，NestJS 適合大型專案，因為有 TypeScript 和依賴注入。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:15:00Z"
        },
        {
          "id": 15,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 Express 和 NestJS 的架構比較圖，可以看看差異。",
          "type": "IMAGE",
          "url": "https://www.sphinx-solution.com/blog/wp-content/uploads/2023/11/web-app-development.webp",
          "createdTime": "2025-03-30T09:16:25Z"
        },
        {
          "id": 16,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "很清楚的對比，NestJS 的架構跟 Angular 有點像。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:17:10Z"
        },
        {
          "id": 17,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "沒錯，那如果做即時通訊，WebSocket 還是 Socket.io 比較好？",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:18:20Z"
        },
        {
          "id": 18,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "Socket.io 更方便，內建很多功能，但底層還是基於 WebSocket。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:19:40Z"
        },
        {
          "id": 19,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 WebSocket 和 Socket.io 的比較圖，看看它們的差異。",
          "type": "IMAGE",
          "url": "https://cdn.educba.com/academy/wp-content/uploads/2018/11/WebSocket-vs-Socket.io_-2.png",
          "createdTime": "2025-03-30T09:20:50Z"
        },
        {
          "id": 20,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "清楚多了，Socket.io 確實省掉很多繁瑣的 WebSocket 設置。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:22:00Z"
        },
        {
          "id": 21,
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "如果做微服務架構，你會選擇什麼框架？",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:23:10Z"
        },
        {
          "id": 22,
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "Spring Boot（Java）或 NestJS（Node.js）都是不錯的選擇，看你的技術棧。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:24:20Z"
        }
      ]
      
    })
    : callFetch("/chat/load", "POST", token, data)
}

export const fetchLoadChatUnread = async (
  data: ChatLoadLastAndUnReadRequest,
  token?: string,
): Promise<ApiResponse<ChatLoadLastAndUnReadResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      chatAndUnReads: [
        {
          "roomId": 1,
          "chat": {
            "id": 22,
            "name": "Alice",
            "roomId": 2,
            "userId": 2,
            "message": "Spring Boot（Java）或 NestJS（Node.js）都是不錯的選擇，看你的技術棧。",
            "type": "TEXT",
            "createdTime": "2025-03-30T10:12:34+08:00"
          },
          "unread": 22
        },
        {
          "roomId": 2,
          "chat": {
            "id": 22,
            "name": "Bob",
            "roomId": 10,
            "userId": 1,
            "message": "Spring Boot（Java）或 NestJS（Node.js）都是不錯的選擇，看你的技術棧。",
            "type": "TEXT",
            "createdTime": "2025-03-30T14:45:10+08:00"
          },
          "unread": 0
        },
        {
          "roomId": 10,
          "chat": {
            "id": 22,
            "name": "Alice",
            "roomId": 1,
            "userId": 2,
            "message": "Hello World",
            "type": "TEXT",
            "createdTime": "2025-03-30T18:05:57+08:00"
          },
          "unread": 100
        }
      ]
    })
    : callFetch("/chat/unread", "POST", token, data)
}

export const fetchSetChatIsRead = async (
  data: ChatIsReadRequest,
  token?: string,
): Promise<ApiResponse<boolean>> => {
  return config.useFake
  ? new FakeSuccessResponse(true)
  : callFetch("/chat/read", "POST", token, data)
}