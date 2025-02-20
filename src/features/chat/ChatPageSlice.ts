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
import { selectTokenInfo, selectWebsocketClient } from "../common/globalSlice"
import type { RootState } from "../../app/store"
import { fetchLoadChat } from "../../services/MessageApi"
import type {
  ChatLoadRequest,
  FriendSearchRequest,
  RoomSearchRequest,
  SpeakRequest,
} from "../../services/RequestInterface"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Client, IMessage } from "@stomp/stompjs"

type FriendsState = {
  friends: FriendInfo[]
  websocket: Client | null
}

type RoomsState = {
  rooms: RoomInfo[]
  websocket: Client | null
}

type FriendState = {
  friendApplyInfoList: FriendApplyInfo[]
  friendInfoList: FriendInfo[]
  roomInfoList: RoomInfo[]
  chatInfoList: ChatInfo[]
  roomChatMap: Map<number, ChatInfo[]>
  roomSubscribeSet: Set<number>
  roomChatLoaded: Set<number>
  status: string
  type: string
  currentRoomId: number
}

const initialState: FriendState = {
  friendApplyInfoList: [],
  friendInfoList: [],
  roomInfoList: [],
  chatInfoList: [],
  roomChatMap: new Map<number, ChatInfo[]>(),
  roomSubscribeSet: new Set<number>(),
  roomChatLoaded: new Set<number>(),
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
        state.roomChatLoaded.add(action.payload)
      },
    ),
    sendMessage: create.asyncThunk(
      async (request: SpeakRequest, { getState }): Promise<ChatInfo> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const stompClient = selectWebsocketClient(state)
        const chatType = state.chat.type
        let success

        const publishType = getPublishType(chatType)
        if (publishType && stompClient) {
          stompClient.publish({
            destination: publishType,
            body: "Hello world",
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
        fulfilled: (state, action) => {
          state.status = "idle"
          state.chatInfoList.push(action.payload)
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadFriends: create.asyncThunk(
      async (
        request: FriendSearchRequest,
        { getState },
      ): Promise<FriendsState> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const stompClient = selectWebsocketClient(state)
        const response = await fetchSearchFriend(request, tokenInfo?.token)
        return {
          friends: response.data?.friends ?? [],
          websocket: stompClient,
        }
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.friendInfoList = action.payload.friends
          console.log("loadFriends", action.payload.friends)

          const stompClient = action.payload.websocket
          if (!stompClient) return

          state.friendInfoList.forEach(friendInfo => {
            const roomId = friendInfo.roomId
            if (state.roomSubscribeSet.has(roomId)) return

            const topic = "/topic/group/" + roomId
            stompClient.subscribe(topic, (message: IMessage) => {
              const arr = state.roomChatMap.get(roomId) || []
              const newChat = JSON.parse(message.body) as ChatInfo
              arr.push(newChat)

              state.roomChatMap.set(roomId, arr.slice(-100))
            })
          })
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadGroups: create.asyncThunk(
      async (request: RoomSearchRequest, { getState }): Promise<RoomsState> => {
        const state = getState() as RootState
        const stompClient = selectWebsocketClient(state)
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchRoom(request, tokenInfo?.token)
        return {
          rooms: response.data?.rooms ?? [],
          websocket: stompClient,
        }
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.roomInfoList = action.payload.rooms
          console.log("loadGroups", action.payload)

          const stompClient = action.payload.websocket
          if (!stompClient) return

          state.roomInfoList.forEach(roomInfo => {
            const roomId = roomInfo.id
            if (state.roomSubscribeSet.has(roomId)) return

            const topic = "/topic/group/" + roomId
            stompClient.subscribe(topic, (message: IMessage) => {
              const arr = state.roomChatMap.get(roomId) || []
              const newChat = JSON.parse(message.body) as ChatInfo
              arr.push(newChat)

              state.roomChatMap.set(roomId, arr.slice(-100))
            })
          })
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadChats: create.asyncThunk(
      async (request: ChatLoadRequest, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchLoadChat(request, tokenInfo?.token)
        return response.data?.chats
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.chatInfoList = action.payload ?? []
          console.log("loadChats", action.payload)
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
        const response = await fetchSearchFriendApply(request, tokenInfo?.token)
        return response.data?.applicants
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.friendApplyInfoList = action.payload ?? []
          console.log("loadFriendApply", action.payload)
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
