import type { ChatIsReadRequest, ChatLoadDateRequest, ChatLoadLastAndUnReadRequest, ChatLoadRequest, ChatSearchRequest } from "./RequestInterface"
import type { ApiResponse, ChatLoadLastAndUnReadResponse, ChatLoadResponse } from "./ResponseInterface"
import { callFetch } from "./common"
import config from "../app/config"
import { FakeSuccessResponse } from "./FakeSuccessResponse"
import { defaultChats, previousChats, afterChats } from "./fakeData"

export const fetchLoadChat = async (
  data: ChatLoadRequest,
  token?: string,
): Promise<ApiResponse<ChatLoadResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      chats: data.searchAfter === undefined ? defaultChats : data.searchAfter ? afterChats : previousChats
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
            "id": "22",
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
            "id": "22",
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
            "id": "22",
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

export const fetchLoadChatByDate = async (
  data: ChatLoadDateRequest,
  token?: string,
): Promise<ApiResponse<ChatLoadResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      chats: [
        {
          "id": "1",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "最近 Java 21 發布了，你有關注它的新特性嗎？",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:00:00Z"
        },
        {
          "id": "2",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "有的，尤其是 Virtual Threads，它大幅提升了併發處理能力。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:01:15Z"
        },
        {
          "id": "3",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "對，我看到 Virtual Threads 可以讓開發者不用擔心傳統 Thread 的高開銷。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:02:40Z"
        },
        {
          "id": "4",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "沒錯，而且 Java 21 也是一個 LTS 版本，企業應該會大規模採用。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:04:00Z"
        },
        {
          "id": "5",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 Java 21 的新特性總結圖，看看有沒有其他你感興趣的。",
          "type": "IMAGE",
          "url": "https://www.aneasystone.com/usr/uploads/2023/12/347920052.png",
          "createdTime": "2025-04-01T10:05:30Z"
        },
        {
          "id": "6",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "模式匹配（Pattern Matching）也很有趣，讓 switch 更強大了！",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:06:45Z"
        },
        {
          "id": "7",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "對啊，record patterns 也讓數據處理變得更簡潔。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:08:10Z"
        },
        {
          "id": "8",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "你有關注 Spring Boot 3 的發展嗎？它全面轉向 Jakarta EE 了。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:09:30Z"
        },
        {
          "id": "9",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "有啊，Spring 6 也放棄了舊的 javax 命名空間，讓很多老專案要適配。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:10:45Z"
        },
        {
          "id": "10",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "是的，不過 GraalVM 原生映像的支持也讓 Spring Boot 3 更快了。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:12:00Z"
        },
        {
          "id": "11",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 Spring Boot 3 的新特性圖表，可以快速了解變更。",
          "type": "IMAGE",
          "url": "https://images.tpointtech.com/springboot/images/spring-boot-architecture.png",
          "createdTime": "2025-04-01T10:13:30Z"
        },
        {
          "id": "12",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "感謝！Spring Boot 3 的 AOT 編譯確實讓應用啟動速度快了不少。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:15:00Z"
        },
        {
          "id": "13",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "說到 Java 生態，你有試過 Quarkus 或 Micronaut 嗎？",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:16:20Z"
        },
        {
          "id": "14",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "有，Quarkus 的冷啟動速度非常快，適合無伺服器（Serverless）應用。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:17:40Z"
        },
        {
          "id": "15",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 Quarkus 和 Micronaut 的比較圖，可以看看它們的特性。",
          "type": "IMAGE",
          "url": "https://cdn-ak.f.st-hatena.com/images/fotolife/a/acro-sakamoto/20221020/20221020010009.png",
          "createdTime": "2025-04-01T10:19:00Z"
        },
        {
          "id": "16",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "很棒的資源！這兩個框架都很適合雲原生應用。",
          "type": "TEXT",
          "createdTime": "2025-04-01T10:20:30Z"
        }
      ]
    })
    : callFetch("/chat/load/date", "POST", token, data)
}

export const fetchSearchChat = async (
  data: ChatSearchRequest,
  token?: string,
): Promise<ApiResponse<ChatLoadResponse>> => {
  return config.useFake
    ? new FakeSuccessResponse({
      chats: [
        {
          "id": "9",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "沒錯，那後端開發你比較推薦 Node.js 還是 Python？",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:09:20Z"
        },
        {
          "id": "10",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "看需求，如果要做 API 服務，Node.js 很適合，機器學習相關的話 Python 更強。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:10:30Z"
        },
        {
          "id": "11",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "這是 Node.js 和 Python 的性能比較圖，看看哪個更符合你的需求。",
          "type": "IMAGE",
          "url": "https://blog.webcodegenie.com/Node.js-vs-Python-Pros-and-Cons-for-Backend-Development-2048x1365.jpg",
          "createdTime": "2025-03-30T09:11:45Z"
        },
        {
          "id": "12",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "確實，Node.js 的 I/O 性能很強，適合高並發應用。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:13:00Z"
        },
        {
          "id": "13",
          "userId": 2,
          "name": "Alice",
          "roomId": 1,
          "message": "如果用 Node.js，Express 和 NestJS 你會怎麼選？",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:14:10Z"
        },
        {
          "id": "22",
          "userId": 1,
          "name": "Bob",
          "roomId": 1,
          "message": "Spring Boot（Java）或 NestJS（Node.js）都是不錯的選擇，看你的技術棧。",
          "type": "TEXT",
          "createdTime": "2025-03-30T09:24:20Z"
        }
      ]
    })
    : callFetch("/chat/search", "POST", token, data)
}