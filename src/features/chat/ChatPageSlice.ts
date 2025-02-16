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
import { selectTokenInfo } from "../common/globalSlice"
import type { RootState } from "../../app/store"
import {
  fetchLoadChat,
  fetchSpeakToRoom,
  fetchSpeakToUser,
} from "../../services/MessageApi"
import type {
  ChatLoadRequest,
  FriendSearchRequest,
  RoomSearchRequest,
  SpeakRequest,
} from "../../services/RequestInterface"
import type { PayloadAction } from "@reduxjs/toolkit"

type NewMessageState = {
  chatInfo: ChatInfo
  success: boolean
}

type FriendState = {
  friendApplyInfoList: FriendApplyInfo[]
  friendInfoList: FriendInfo[]
  roomInfoList: RoomInfo[]
  chatInfoList: ChatInfo[]
  status: string
  type: string
  currentRoomId: number
}

const initialState: FriendState = {
  friendApplyInfoList: [],
  friendInfoList: [],
  roomInfoList: [],
  chatInfoList: [],
  status: "",
  type: "",
  currentRoomId: 0,
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
    sendMessage: create.asyncThunk(
      async (request: SpeakRequest, { getState }): Promise<NewMessageState> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const chatType = state.chat.type
        let response
        switch (chatType) {
          case "user": {
            response = await fetchSpeakToUser(request, tokenInfo?.token)
            break
          }
          case "room": {
            response = await fetchSpeakToRoom(request, tokenInfo?.token)
            break
          }
          default:
            break
        }
        return {
          chatInfo: {
            id: Math.floor(Math.random() * 100000000),
            name: "Bob",
            roomId: request.roomId,
            userId: tokenInfo?.userId ?? 1,
            message: request.message,
            type: "text",
          },
          success: response?.data ?? false,
        }
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.chatInfoList.push(action.payload.chatInfo)
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadFriends: create.asyncThunk(
      async (request: FriendSearchRequest, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchFriend(request, tokenInfo?.token)
        return response.data?.friends
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.friendInfoList = action.payload ?? []
          console.log("loadFriends", action.payload)
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
        return response.data?.rooms
      },
      {
        pending: state => {
          state.status = "loading"
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.roomInfoList = action.payload ?? []
          console.log("loadGroups", action.payload)
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
  selectFriendApplyInfoList,
  selectStatus,
  selectCurrentRoomId,
} = chatSlice.selectors
