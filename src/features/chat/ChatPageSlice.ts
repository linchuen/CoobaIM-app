import type { FriendInfo, RoomInfo } from "../../services/ResponseInterface"
import { fetchSearchFriend } from "../../services/FriendApi"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchSearchRoom } from "../../services/RoomApi"
import { selectTokenInfo } from "../common/globalSlice"
import type { RootState } from "../../app/store"

type FriendState = {
  friendInfoList: FriendInfo[]
  roomInfoList: RoomInfo[]
  status: string
}

const initialState: FriendState = {
  friendInfoList: [],
  roomInfoList: [],
  status: "",
}

export const chatSlice = createAppSlice({
  name: "chat",
  initialState,
  reducers: create => ({
    loadFriends: create.asyncThunk(
      async (friendUserIds: number[], { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchFriend(
          {
            friendUserIds: friendUserIds,
          },
          tokenInfo?.token,
        )
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
      async (roomIds: number[], { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchRoom(
          {
            roomIds: roomIds,
          },
          tokenInfo?.token,
        )
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
  }),
  selectors: {
    selectFriendInfoList: state => state.friendInfoList,
    selectRoomInfoList: state => state.roomInfoList,
    selectStatus: state => state.status,
  },
})

export const { loadFriends, loadGroups } = chatSlice.actions

export const { selectFriendInfoList, selectRoomInfoList, selectStatus } =
  chatSlice.selectors
