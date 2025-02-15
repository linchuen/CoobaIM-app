import type {
  ChatInfo,
  FriendInfo,
  RoomInfo,
} from "../../services/ResponseInterface"
import { fetchSearchFriend } from "../../services/FriendApi"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchSearchRoom } from "../../services/RoomApi"
import { selectTokenInfo } from "../common/globalSlice"
import type { RootState } from "../../app/store"
import { fetchLoadChat } from "../../services/MessageApi"
import type {
  ChatLoadRequest,
  FriendSearchRequest,
  RoomSearchRequest,
} from "../../services/RequestInterface"

type FriendState = {
  friendInfoList: FriendInfo[]
  roomInfoList: RoomInfo[]
  chatInfoList: ChatInfo[]
  status: string
}

const initialState: FriendState = {
  friendInfoList: [],
  roomInfoList: [],
  chatInfoList: [],
  status: "",
}

export const chatSlice = createAppSlice({
  name: "chat",
  initialState,
  reducers: create => ({
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
  }),
  selectors: {
    selectFriendInfoList: state => state.friendInfoList,
    selectRoomInfoList: state => state.roomInfoList,
    selectChatInfoList: state => state.chatInfoList,
    selectStatus: state => state.status,
  },
})

export const { loadFriends, loadGroups, loadChats } = chatSlice.actions

export const {
  selectFriendInfoList,
  selectRoomInfoList,
  selectChatInfoList,
  selectStatus,
} = chatSlice.selectors
