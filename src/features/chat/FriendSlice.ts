import type {
  FriendApplyInfo,
  FriendInfo,
} from "../../services/ResponseInterface"
import {
  fetchSearchFriend,
  fetchSearchFriendApply,
} from "../../services/FriendApi"
import { createAppSlice } from "../../app/createAppSlice"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import type {
  FriendSearchRequest,
} from "../../services/RequestInterface"
import type { PayloadAction } from "@reduxjs/toolkit"


type FriendState = {
  friendApplyInfoList: FriendApplyInfo[]
  friendInfoList: FriendInfo[]
}

const initialState: FriendState = {
  friendApplyInfoList: [],
  friendInfoList: [],
}

export const friendSlice = createAppSlice({
  name: "friend",
  initialState,
  reducers: create => ({
    addFriendApply: create.reducer((state, action: PayloadAction<FriendApplyInfo>) => {
      state.friendApplyInfoList.push(action.payload)
    }),
    removeFriendApply: create.reducer((state, action: PayloadAction<number>) => {
      state.friendApplyInfoList = state.friendApplyInfoList.filter(
        info => info.applyId !== action.payload,
      )
    }),
    addFriend: create.reducer((state, action: PayloadAction<FriendInfo>) => {
      state.friendInfoList.push(action.payload)
    }),
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
          state.friendInfoList = action.payload
        },
        rejected: () => { },
      },
    ),
    loadFriendApply: create.asyncThunk(
      async (request: null, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchSearchFriendApply(request, tokenInfo?.token)
        return response.data.applicants
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          state.friendApplyInfoList = action.payload ?? []
        },
        rejected: () => { },
      },
    ),
  }),
  selectors: {
    selectFriendInfoList: state => state.friendInfoList,
    selectFriendApplyInfoList: state => state.friendApplyInfoList,
  },
})

export const {
  loadFriends,
  loadFriendApply,
  addFriend,
  addFriendApply,
  removeFriendApply,
} = friendSlice.actions

export const {
  selectFriendInfoList,
  selectFriendApplyInfoList,
} = friendSlice.selectors
