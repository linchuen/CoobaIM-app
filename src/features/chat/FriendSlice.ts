import type {
  FriendApplyInfo,
  FriendInfo,
} from "../../services/ResponseInterface"
import {
  fetchPermitFriend,
  fetchSearchFriend,
  fetchSearchFriendApply,
} from "../../services/FriendApi"
import { createAppSlice } from "../../app/createAppSlice"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import type {
  FriendRequest,
  FriendSearchRequest,
} from "../../services/RequestInterface"
import type { PayloadAction } from "@reduxjs/toolkit"

interface FriendApplyState {
  request: FriendRequest
  name: string
}
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
    reset: create.reducer((state, action: PayloadAction<void>) => {
      state.friendApplyInfoList = []
      state.friendInfoList = []
    }),
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
    handleFriendApply: create.asyncThunk(
      async (apply: FriendApplyState, { getState }) => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchPermitFriend(apply.request, tokenInfo?.token ?? "")
        return {
          request: apply.request,
          roomId: response.data.roomId,
          name: apply.name
        }
      },
      {
        pending: () => { },
        fulfilled: (state, action) => {
          const request = action.payload.request
          friendSlice.caseReducers.removeFriendApply(state, {
            payload: request.applyUserId,
            type: "removeFriendApply"
          })
          if (request.isPermit) {
            friendSlice.caseReducers.addFriend(state, {
              payload: {
                userId: request.permitUserId,
                friendUserId: request.applyUserId,
                showName: action.payload.name,
                roomId: action.payload.roomId,
              },
              type: "addFriend"
            })
          }
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
  reset,
  loadFriends,
  loadFriendApply,
  addFriend,
  addFriendApply,
  removeFriendApply,
  handleFriendApply,
} = friendSlice.actions

export const {
  selectFriendInfoList,
  selectFriendApplyInfoList,
} = friendSlice.selectors
