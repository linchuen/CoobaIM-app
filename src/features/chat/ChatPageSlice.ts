import type {
  ChatInfo,
  LastChatAndUnRead,
  RoomInfo,
} from "../../services/ResponseInterface"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchSearchRoom } from "../../services/RoomApi"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchLoadChat, fetchLoadChatByDate, fetchLoadChatUnread, fetchSetChatIsRead } from "../../services/MessageApi"
import type {
  ChatLoadDateRequest,
  ChatLoadLastAndUnReadRequest,
  ChatLoadRequest,
  RoomSearchRequest,
  SpeakRequest,
} from "../../services/RequestInterface"
import type { PayloadAction } from "@reduxjs/toolkit"
import { WebSocketManager } from "../../services/websocketApi"
import config from "../../app/config"
import { ChatType } from "../../services/constant"
import { SpeakRequest as Speak } from "../../../proto/SpeakProto"

type UnreadState = {
  chatAndUnReads: LastChatAndUnRead[]
  userId: number
}

type MessageState = {
  newChat: ChatInfo
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
  pastChatInfoList: ChatInfo[]
  roomChatMap: Record<number, ChatInfo[]>
  roomUnreadMap: Record<number, LastChatAndUnRead>
  roomSubscribeSet: number[]
  roomChatLoaded: number[]
  eventSubscribeSet: string[]
  chatType: ChatType;
  currentRoomId: number
  currentRoomName: string
  emoji: string
  usePast: boolean
}

const initialState: ChatRoomState = {
  roomInfoList: [],
  chatInfoList: [],
  pastChatInfoList: [],
  roomChatMap: {},
  roomUnreadMap: [],
  roomSubscribeSet: [],
  roomChatLoaded: [],
  eventSubscribeSet: [],
  chatType: ChatType.ToNobody,
  currentRoomId: 0,
  currentRoomName: "",
  emoji: "",
  usePast: false
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
      state.roomInfoList = []
      state.chatInfoList = []
      state.pastChatInfoList = []
      state.roomChatMap = {}
      state.roomUnreadMap = []
      state.roomSubscribeSet = []
      state.roomChatLoaded = []
      state.eventSubscribeSet = []
      state.chatType = ChatType.ToNobody
      state.currentRoomId = 0
      state.currentRoomName = ""
      state.emoji = ""
      state.usePast = false
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
        const newChat = action.payload.newChat
        const lastChatAndUnRead = state.roomUnreadMap[roomId]

        console.log("room: %s received message %s", roomId, newChat)
        const arr = state.roomChatMap[roomId] ?? []
        arr.push(newChat)

        state.roomChatMap[roomId] = arr.slice(-100)

        state.roomUnreadMap[roomId] = {
          roomId: roomId,
          chat: newChat,
          unread: state.currentRoomId === roomId ? 0 : lastChatAndUnRead.unread + 1
        }

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
          stompClient.sendBinaryMessage(publishType, Speak.fromObject(request))
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
          createdTime: new Date().toISOString()
        }
      },
      {
        pending: () => { },
        fulfilled: (state, action: PayloadAction<ChatInfo>) => {
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
        const roomChatMap = selectRoomChatMap(state)
        const roomChats = roomChatMap[request.roomId]

        const isLoaded = roomChatLoaded.includes(request.roomId)
        const isMessageFull = roomChats && roomChats.length >= 100
        if (isLoaded || isMessageFull) {
          return {
            chats: roomChats,
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
          const chats = action.payload.chats
          const roomId = action.payload.roomId

          state.chatInfoList = chats
          state.roomChatLoaded.push(roomId)
          state.roomChatMap[roomId] = chats
          state.usePast = false
        },
        rejected: () => { },
      },
    ),
    loadPastChats: create.asyncThunk(
      async (request: ChatLoadDateRequest, { getState }): Promise<ChatState> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)

        const response = await fetchLoadChatByDate(request, tokenInfo?.token)
        return {
          chats: response.data.chats,
          roomId: request.roomId,
        }
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          const chats = action.payload.chats

          state.pastChatInfoList = chats
          state.usePast = true
        },
        rejected: () => { },
      },
    ),
    loadChatUnread: create.asyncThunk(
      async (request: ChatLoadLastAndUnReadRequest, { getState }): Promise<UnreadState> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchLoadChatUnread(request, tokenInfo?.token)
        return {
          chatAndUnReads: response.data.chatAndUnReads,
          userId: tokenInfo?.userId ?? 0
        }
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          const chatAndUnReads = action.payload.chatAndUnReads

          state.roomUnreadMap = chatAndUnReads.reduce((accumulator, chat) => {
            accumulator[chat.roomId] = chat;
            const isSelf = chat.chat.userId === action.payload.userId
            console.log(chat.roomId, isSelf)
            chat.unread = isSelf ? 0 : chat.unread
            return accumulator;
          }, {} as Record<number, LastChatAndUnRead>);
        },
        rejected: () => { },
      },
    ),
    resetUnreadCount: create.asyncThunk(
      async (request: number, { getState }): Promise<number> => {
        const roomId = request
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const roomUnreadMap = selectRoomUnreadMap(state)
        const chatId = roomUnreadMap[roomId] ? roomUnreadMap[roomId].chat.id : 0
        await fetchSetChatIsRead({ roomId: roomId, chatId: chatId }, tokenInfo?.token)
        return roomId
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          const roomId = action.payload
          state.roomUnreadMap[roomId].unread = 0
        },
        rejected: () => { },
      },
    )
  }),
  selectors: {
    selectRoomInfoList: state => state.roomInfoList,
    selectChatInfoList: state => state.chatInfoList,
    selectPastChatInfoList: state => state.pastChatInfoList,
    selectRoomChatMap: state => state.roomChatMap,
    selectRoomUnreadMap: state => state.roomUnreadMap,
    selectRoomChatLoaded: state => state.roomChatLoaded,
    selectRoomSubscribeSet: state => state.roomSubscribeSet,
    selectEventSubscribeSet: state => state.eventSubscribeSet,
    selectCurrentRoomId: state => state.currentRoomId,
    selectCurrentRoomName: state => state.currentRoomName,
    selectEmoji: state => state.emoji,
    selectUsePast: state => state.usePast,
  },
})

export const {
  loadGroups,
  loadChats,
  loadPastChats,
  loadChatUnread,
  subscribeGroups,
  setChatType,
  setCurrentRoomId,
  setCurrentRoomName,
  sendMessage,
  addRoom,
  addSubscribeEvent,
  setEmoji,
  reset,
  resetUnreadCount
} = chatSlice.actions

export const {
  selectRoomInfoList,
  selectChatInfoList,
  selectPastChatInfoList,
  selectRoomChatMap,
  selectRoomUnreadMap,
  selectRoomChatLoaded,
  selectRoomSubscribeSet,
  selectEventSubscribeSet,
  selectCurrentRoomId,
  selectCurrentRoomName,
  selectEmoji,
  selectUsePast,
} = chatSlice.selectors
