import type {
  ChatInfo,
  LastChatAndUnRead,
  RoomInfo,
} from "../../services/ResponseInterface"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchSearchRoom } from "../../services/RoomApi"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchLoadChat, fetchLoadChatUnread } from "../../services/MessageApi"
import type {
  ChatLoadLastAndUnReadRequest,
  ChatLoadRequest,
  RoomSearchRequest,
  SpeakRequest,
} from "../../services/RequestInterface"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { IMessage } from "@stomp/stompjs"
import { WebSocketManager } from "../../services/websocketApi"
import config from "../../app/config"
import { ChatType } from "../../services/constant"

type MessageState = {
  message: IMessage
  roomId: number
  userId: number
}

type ChatState = {
  chats: ChatInfo[]
  roomId: number
}

type ChatRoomState = {
  roomInfoList: RoomInfo[]
  chatInfoList: ChatInfo[]
  roomChatMap: Record<number, ChatInfo[]>
  roomUnreadMap: Record<number, LastChatAndUnRead>
  roomSubscribeSet: number[]
  roomChatLoaded: number[]
  eventSubscribeSet: string[]
  status: string
  chatType: ChatType;
  currentRoomId: number
  currentRoomName: string
  emoji: string
}

const initialState: ChatRoomState = {
  roomInfoList: [],
  chatInfoList: [],
  roomChatMap: {},
  roomUnreadMap: [],
  roomSubscribeSet: [],
  roomChatLoaded: [],
  eventSubscribeSet: [],
  status: "",
  chatType: ChatType.ToNobody,
  currentRoomId: 0,
  currentRoomName: "",
  emoji: ""
}

function getPublishType(chatType: ChatType): string {
  switch (chatType) {
    case "user":
      return "/app/sendToUser"
    case "room":
      return "/app/sendToRoom"
    default:
      return ""
  }
}

export const chatSlice = createAppSlice({
  name: "chat",
  initialState,
  reducers: create => ({
    reset: create.reducer((state, action: PayloadAction<void>) => {
      console.log("reset")
      state.currentRoomId = 0
      state.chatInfoList = []
      state.currentRoomName = ""
    }),
    setEmoji: create.reducer((state, action: PayloadAction<string>) => {
      console.log("emoji", action.payload)
      state.emoji = action.payload
    }),
    setChatType: create.reducer((state, action: PayloadAction<ChatType>) => {
      state.chatType = action.payload
    }),
    setCurrentRoomId: create.reducer((state, action: PayloadAction<number>) => {
      state.currentRoomId = action.payload
    }),
    setCurrentRoomName: create.reducer((state, action: PayloadAction<string>) => {
      state.currentRoomName = action.payload
    }),
    addRoom: create.reducer((state, action: PayloadAction<RoomInfo>) => {
      state.roomInfoList.push(action.payload)
    }),
    setRoomChatLoaded: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.roomChatLoaded.push(action.payload)
      },
    ),
    addSubscribeEvent: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.eventSubscribeSet.push(action.payload)
      },
    ),
    subscribeGroups: create.reducer(
      (state, action: PayloadAction<MessageState>) => {
        const userId = action.payload.userId
        const roomId = action.payload.roomId
        const message = action.payload.message

        console.log("room: %s received message %s", roomId, message.body)
        const arr = state.roomChatMap[roomId] ?? []
        const newChat = JSON.parse(message.body) as ChatInfo
        arr.push(newChat)

        state.roomChatMap[roomId] = arr.slice(-100)

        if (state.currentRoomId === roomId && userId !== newChat.userId) {
          state.chatInfoList.push(newChat)
        }
        state.roomSubscribeSet.push(roomId)
      },
    ),
    sendMessage: create.asyncThunk(
      async (request: SpeakRequest, { getState }): Promise<ChatInfo> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const chatType = state.chat.chatType
        const publishType = getPublishType(chatType)
        let success

        if (publishType && !config.useFake) {
          const stompClient = WebSocketManager.getInstance()
          stompClient.sendMessage(publishType, request)
          success = true
        }

        return {
          uuid: request.uuid,
          id: Math.floor(Math.random() * 100000000),
          name: tokenInfo?.name ?? "",
          roomId: request.roomId,
          userId: tokenInfo?.userId ?? 1,
          message: request.message,
          url: request.url,
          type: request.type ?? "TEXT",
          success: success,
        }
      },
      {
        pending: () => { },
        fulfilled: (state, action: PayloadAction<ChatInfo>) => {
          state.status = "idle"
          const chatInfo = action.payload
          console.log("new chat", chatInfo)

          state.chatInfoList.push(chatInfo)
          const chatInfoList = state.roomChatMap[chatInfo.roomId] ?? []
          chatInfoList.push(chatInfo)
        },
        rejected: () => { },
      },
    ),
    loadGroups: create.asyncThunk(
      async (request: RoomSearchRequest, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchRoom(request, tokenInfo?.token)
        return response.data.rooms
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.roomInfoList = action.payload
        },
        rejected: () => { },
      },
    ),
    loadChats: create.asyncThunk(
      async (request: ChatLoadRequest, { getState }): Promise<ChatState> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const roomChatLoaded = selectRoomChatLoaded(state)
        const roomChats = selectRoomChatMap(state)
        const roomChat = roomChats[request.roomId]

        const isLoaded = roomChatLoaded.includes(request.roomId)
        const isMessageFull = roomChat && roomChat.length >= 100
        if (isLoaded || isMessageFull) {
          return {
            chats: roomChat,
            roomId: request.roomId,
          }
        }

        const response = await fetchLoadChat(request, tokenInfo?.token)
        return {
          chats: response.data.chats,
          roomId: request.roomId,
        }
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          state.status = "idle"
          const chats = action.payload.chats
          const roomId = action.payload.roomId

          state.chatInfoList = chats
          state.roomChatLoaded.push(roomId)
          state.roomChatMap[roomId] = chats
        },
        rejected: () => { },
      },
    ),
    loadChatUnread: create.asyncThunk(
      async (request: ChatLoadLastAndUnReadRequest, { getState }): Promise<LastChatAndUnRead[]> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)

        const response = await fetchLoadChatUnread(request, tokenInfo?.token)
        return response.data.chatAndUnReads
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          state.roomUnreadMap = action.payload
        },
        rejected: () => { },
      },
    ),
  }),
  selectors: {
    selectRoomInfoList: state => state.roomInfoList,
    selectChatInfoList: state => state.chatInfoList,
    selectRoomChatMap: state => state.roomChatMap,
    selectRoomUnreadMap: state => state.roomUnreadMap,
    selectRoomChatLoaded: state => state.roomChatLoaded,
    selectRoomSubscribeSet: state => state.roomSubscribeSet,
    selectEventSubscribeSet: state => state.eventSubscribeSet,
    selectStatus: state => state.status,
    selectCurrentRoomId: state => state.currentRoomId,
    selectCurrentRoomName: state => state.currentRoomName,
    selectEmoji: state => state.emoji,
  },
})

export const {
  loadGroups,
  loadChats,
  subscribeGroups,
  setChatType,
  setCurrentRoomId,
  setCurrentRoomName,
  sendMessage,
  addRoom,
  addSubscribeEvent,
  setEmoji,
  reset
} = chatSlice.actions

export const {
  selectRoomInfoList,
  selectChatInfoList,
  selectRoomChatMap,
  selectRoomUnreadMap,
  selectRoomChatLoaded,
  selectRoomSubscribeSet,
  selectEventSubscribeSet,
  selectStatus,
  selectCurrentRoomId,
  selectCurrentRoomName,
  selectEmoji,
} = chatSlice.selectors
