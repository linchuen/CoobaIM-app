import type {
  ChatInfo,
  FriendInfo,
  RoomInfo,
} from "../../services/ResponseInterface"
import {
  fetchSearchFriend,
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
import { fetchSearchChannel } from "../../services/cs/Channel"
import type { OfficialChannel, Ticket } from "../../services/cs/CsResponseInterface"
import type { CustomerEnterRequest } from "../../services/cs/CsRequestInterface"
import { fetchEnterRoom } from "../../services/cs/CustomerApi"
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

type ChannelState = {
  ticket: Ticket
  chats: ChatInfo[]
  channelId: number
}

type ChatRoomState = {
  friendInfoList: FriendInfo[]
  roomInfoList: RoomInfo[]
  chatInfoList: ChatInfo[]
  roomChatMap: Record<number, ChatInfo[]>
  roomSubscribeSet: number[]
  roomChatLoaded: number[]
  channelLoaded: Record<number, Ticket>
  eventSubscribeSet: string[]
  status: string
  chatType: ChatType
  currentRoomId: number
  currentRoomName: string
  emoji: string
  channelList: OfficialChannel[]
}

const initialState: ChatRoomState = {
  friendInfoList: [],
  roomInfoList: [],
  chatInfoList: [],
  roomChatMap: {},
  roomSubscribeSet: [],
  roomChatLoaded: [],
  channelLoaded: {},
  eventSubscribeSet: [],
  status: "",
  chatType: ChatType.ToNobody,
  currentRoomId: 0,
  currentRoomName: "",
  emoji: "",
  channelList: [],
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

export const customerSupportSlice = createAppSlice({
  name: "customer_support",
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
    addFriend: create.reducer((state, action: PayloadAction<FriendInfo>) => {
      state.friendInfoList.push(action.payload)
    }),
    addRoom: create.reducer((state, action: PayloadAction<RoomInfo>) => {
      state.roomInfoList.push(action.payload)
    }),
    addChannel: create.reducer((state, action: PayloadAction<OfficialChannel>) => {
      state.channelList.push(action.payload)
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
    loadFriends: create.asyncThunk(
      async (request: FriendSearchRequest, { getState },) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchFriend(request, tokenInfo?.token ?? "")
        return response.data?.friends ?? []
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.friendInfoList = action.payload
        },
        rejected: () => { },
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
          chats: response.data?.chats ?? [],
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
    loadChannels: create.asyncThunk(
      async (_request: null, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchChannel(tokenInfo?.token)
        return response.data?.channels ?? []
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.channelList = action.payload
        },
        rejected: () => { },
      },
    ),
    enterChannel: create.asyncThunk(
      async (request: CustomerEnterRequest, { getState }): Promise<ChannelState> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const channelLoaded = selectChannelLoaded(state)
        const roomChatLoaded = selectRoomChatLoaded(state)
        const roomChats = selectRoomChatMap(state)
        const ticket = channelLoaded[request.channelId]
        const roomChat = roomChats[ticket.roomId]

        const isLoaded = roomChatLoaded.includes(ticket.roomId)
        const isMessageFull = roomChat && roomChat.length >= 100
        if (isLoaded || isMessageFull) {
          return {
            ticket: ticket,
            chats: roomChat,
            channelId: request.channelId,
          }
        }

        const response = await fetchEnterRoom(request, tokenInfo?.token)
        if (!response.data) throw new Error(`API Error: ${response}`);
        return {
          ticket: response.data.ticket,
          chats: response.data.chats,
          channelId: request.channelId,
        }
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          state.status = "idle"
          const ticket = action.payload.ticket
          const chats = action.payload.chats
          const roomId = ticket.roomId
          const channelId = action.payload.channelId

          state.chatInfoList = chats
          state.channelLoaded[channelId] = ticket
          state.roomChatLoaded.push(roomId)
          state.roomChatMap[roomId] = chats
        },
        rejected: () => { },
      },
    ),
  }),
  selectors: {
    selectFriendInfoList: state => state.friendInfoList,
    selectRoomInfoList: state => state.roomInfoList,
    selectChatInfoList: state => state.chatInfoList,
    selectRoomChatMap: state => state.roomChatMap,
    selectRoomChatLoaded: state => state.roomChatLoaded,
    selectRoomSubscribeSet: state => state.roomSubscribeSet,
    selectEventSubscribeSet: state => state.eventSubscribeSet,
    selectStatus: state => state.status,
    selectCurrentRoomId: state => state.currentRoomId,
    selectCurrentRoomName: state => state.currentRoomName,
    selectEmoji: state => state.emoji,
    selectChannelList: state => state.channelList,
    selectChannelLoaded: state => state.channelLoaded,
  },
})

export const {
  loadFriends,
  loadGroups,
  loadChats,
  loadChannels,
  subscribeGroups,
  setChatType,
  setCurrentRoomId,
  setCurrentRoomName,
  sendMessage,
  addRoom,
  addChannel,
  addFriend,
  addSubscribeEvent,
  setEmoji,
  reset,
  enterChannel
} = customerSupportSlice.actions

export const {
  selectFriendInfoList,
  selectRoomInfoList,
  selectChatInfoList,
  selectRoomChatMap,
  selectRoomChatLoaded,
  selectRoomSubscribeSet,
  selectEventSubscribeSet,
  selectStatus,
  selectCurrentRoomId,
  selectCurrentRoomName,
  selectEmoji,
  selectChannelList,
  selectChannelLoaded,
} = customerSupportSlice.selectors
