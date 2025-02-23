import type {
  ChatInfo,
  FriendApplyInfo,
  FriendInfo,
  RoomInfo,
} from "../../services/ResponseInterface"
import {
  fetchSearchFriend,
  fetchSearchFriendApply,
} from "../../services/FriendApi"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchSearchRoom } from "../../services/RoomApi"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchLoadChat } from "../../services/MessageApi"
import type {
  ChatLoadRequest,
  FriendSearchRequest,
  RoomSearchRequest,
  SpeakRequest,
} from "../../services/RequestInterface"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { IMessage } from "@stomp/stompjs"
import { WebSocketManager } from "../../services/websocketApi"
import config from "../../app/config"

type ChatState = {
  chats: ChatInfo[]
  roomId: number
}

type FriendState = {
  friendApplyInfoList: FriendApplyInfo[]
  friendInfoList: FriendInfo[]
  roomInfoList: RoomInfo[]
  chatInfoList: ChatInfo[]
  roomChatMap: Record<number, ChatInfo[]>
  roomSubscribeSet: number[]
  roomChatLoaded: number[]
  status: string
  type: string
  currentRoomId: number
}

const initialState: FriendState = {
  friendApplyInfoList: [],
  friendInfoList: [],
  roomInfoList: [],
  chatInfoList: [],
  roomChatMap: {},
  roomSubscribeSet: [],
  roomChatLoaded: [],
  status: "",
  type: "",
  currentRoomId: 0,
}

function getPublishType(chatType: string): string {
  switch (chatType) {
    case "user":
      return "app/sendToUser"
    case "room":
      return "app/sendToRoom"
    default:
      return ""
  }
}

export const chatSlice = createAppSlice({
  name: "chat",
  initialState,
  reducers: create => ({
    setType: create.reducer((state, action: PayloadAction<string>) => {
      state.type = action.payload
    }),
    setCurrentRoomId: create.reducer((state, action: PayloadAction<number>) => {
      state.currentRoomId = action.payload
    }),
    removeApply: create.reducer((state, action: PayloadAction<number>) => {
      state.friendApplyInfoList = state.friendApplyInfoList.filter(
        info => info.applyId !== action.payload,
      )
    }),
    addFriend: create.reducer((state, action: PayloadAction<FriendInfo>) => {
      state.friendInfoList.push(action.payload)
    }),
    addRoom: create.reducer((state, action: PayloadAction<RoomInfo>) => {
      state.roomInfoList.push(action.payload)
    }),
    setRoomChatLoaded: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.roomChatLoaded.push(action.payload)
      },
    ),
    sendMessage: create.asyncThunk(
      async (request: SpeakRequest, { getState }): Promise<ChatInfo> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const chatType = state.chat.type
        const publishType = getPublishType(chatType)
        let success

        if (publishType && !config.useFake) {
          const stompClient = WebSocketManager.getInstance()
          stompClient.sendMessage(publishType, {

            body: JSON.stringify(request),
            skipContentLengthHeader: true,
          })
          success = false
        }

        return {
          id: Math.floor(Math.random() * 100000000),
          name: tokenInfo?.name ?? "",
          roomId: request.roomId,
          userId: tokenInfo?.userId ?? 1,
          message: request.message,
          type: "text",
          success: success,
        }
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action: PayloadAction<ChatInfo>) => {
          state.status = "idle"
          const chatInfo = action.payload

          state.chatInfoList.push(chatInfo)
          const chatInfoList = state.roomChatMap[chatInfo.roomId] ?? []
          chatInfoList.push(chatInfo)
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadFriends: create.asyncThunk(
      async (request: FriendSearchRequest, { getState },) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchFriend(request, tokenInfo?.token ?? "")
        return response.data?.friends ?? []
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.friendInfoList = action.payload
          console.log("loadFriends", action.payload)

          if (config.useFake) return
          const stompClient = WebSocketManager.getInstance()

          state.friendInfoList.forEach(friendInfo => {
            const roomId = friendInfo.roomId
            if (state.roomSubscribeSet.includes(roomId)) return

            const topic = "/topic/group/" + roomId
            stompClient.subscribe(topic, (message: IMessage) => {
              const arr = state.roomChatMap[roomId] ?? []
              const newChat = JSON.parse(message.body) as ChatInfo
              arr.push(newChat)

              state.roomChatMap[roomId] = arr.slice(-100)
            })
          })
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadGroups: create.asyncThunk(
      async (request: RoomSearchRequest, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchRoom(request, tokenInfo?.token)
        return response.data?.rooms ?? []
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.roomInfoList = action.payload

          if (config.useFake) return
          const stompClient = WebSocketManager.getInstance()

          state.roomInfoList.forEach(roomInfo => {
            const roomId = roomInfo.id
            if (state.roomSubscribeSet.includes(roomId)) return

            const topic = "/topic/group/" + roomId
            stompClient.subscribe(topic, (message: IMessage) => {
              const arr = state.roomChatMap[roomId] ?? []
              const newChat = JSON.parse(message.body) as ChatInfo
              arr.push(newChat)

              state.roomChatMap[roomId] = arr.slice(-100)
            })
          })
        },
        rejected: state => {
          state.status = "failed"
        },
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
          chats: response.data?.chats ?? [],
          roomId: request.roomId,
        }
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          const chats = action.payload.chats
          const roomId = action.payload.roomId

          state.chatInfoList = chats
          state.roomChatLoaded.push(roomId)
          state.roomChatMap[roomId] = chats
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadFriendApply: create.asyncThunk(
      async (request: null, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchFriendApply(request, tokenInfo?.token ?? "")
        return response.data?.applicants
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.friendApplyInfoList = action.payload ?? []
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
  }),
  selectors: {
    selectFriendInfoList: state => state.friendInfoList,
    selectRoomInfoList: state => state.roomInfoList,
    selectChatInfoList: state => state.chatInfoList,
    selectRoomChatMap: state => state.roomChatMap,
    selectRoomChatLoaded: state => state.roomChatLoaded,
    selectFriendApplyInfoList: state => state.friendApplyInfoList,
    selectStatus: state => state.status,
    selectCurrentRoomId: state => state.currentRoomId,
  },
})

export const {
  loadFriends,
  loadGroups,
  loadChats,
  loadFriendApply,
  setType,
  setCurrentRoomId,
  sendMessage,
  addRoom,
  addFriend,
  removeApply,
} = chatSlice.actions

export const {
  selectFriendInfoList,
  selectRoomInfoList,
  selectChatInfoList,
  selectRoomChatMap,
  selectRoomChatLoaded,
  selectFriendApplyInfoList,
  selectStatus,
  selectCurrentRoomId,
} = chatSlice.selectors
