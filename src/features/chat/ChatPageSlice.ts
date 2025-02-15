import type { FriendInfo, RoomInfo } from "../../services/ResponseInterface"
import { fetchSearchFriend } from "../../services/FriendApi"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchSearchRoom } from "../../services/RoomApi"
import { useAppSelector } from "../../app/hooks"
import { selectTokenInfo } from "../common/globalSlice"

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
      async (friendUserIds: number[]) => {
        const tokenInfo = useAppSelector(selectTokenInfo)
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
          console.log("loadFriends", action.payload)
          state.status = "idle"
          state.friendInfoList = action.payload ?? []
        },
        rejected: state => {
          state.status = "failed"
        },
      },
    ),
    loadGroups: create.asyncThunk(
      async (roomIds: number[]) => {
        const tokenInfo = useAppSelector(selectTokenInfo)
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
          console.log("loadGroups", action.payload)
          state.roomInfoList = action.payload ?? []
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

export default chatSlice.reducer
