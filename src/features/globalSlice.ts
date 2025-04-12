import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { LiveCall, LoginResponse } from "../services/ResponseInterface"
import { fetchFreshToken } from "../services/UserAPI"
import type { RefreshRequest } from "../services/RequestInterface"
import type { RootState } from "../app/store"

interface TokenInfo {
  userId: number
  name: string
  token: string
  role: string
  platform: string
  avatar?: string
  loginTime: string
  expireTime: string
}

interface GlobalState {
  email: string | null
  tokenInfo: TokenInfo | null
  isLogin: boolean
  errorMessage: string
  errorDialogOpen: boolean
  callDialogOpen: boolean,
  liveCall: LiveCall | null,
}

const initialState: GlobalState = {
  email: "",
  tokenInfo: null,
  isLogin: false,
  errorMessage: "",
  errorDialogOpen: false,
  callDialogOpen: false,
  liveCall: null
}

export const globalSlice = createAppSlice({
  name: "global",
  initialState,
  reducers: create => ({
    setEmail: create.reducer((state, action: PayloadAction<string>) => {
      state.email = action.payload
    }),
    clearEmail: create.reducer(state => {
      state.email = null
    }),
    setTokenInfo: create.reducer((state, action: PayloadAction<TokenInfo>) => {
      console.log("setTokenInfo", action.payload)
      state.tokenInfo = action.payload
    }),
    setIsLogin: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    }),
    setErrorMessage: create.reducer((state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
    }),
    setErrorDialogOpen: create.reducer((state, action: PayloadAction<boolean>) => {
      state.errorDialogOpen = action.payload
    }),
    setCallDialogOpen: create.reducer((state, action: PayloadAction<boolean>) => {
      state.callDialogOpen = action.payload
    }),
    setLiveCall: create.reducer((state, action: PayloadAction<LiveCall>) => {
      state.liveCall = action.payload
    }),
    refreshToken: create.asyncThunk(
      async (request: RefreshRequest, { getState }): Promise<LoginResponse> => {
        const state = getState() as RootState
        const tokenInfo = selectTokenInfo(state)
        const response = await fetchFreshToken(request, tokenInfo?.token ?? "")
        return response.data;
      },
      {
        pending: () => { },
        fulfilled: (state, action: PayloadAction<LoginResponse>) => {
          globalSlice.caseReducers.setTokenInfo(state, {
            payload: action.payload,
            type: "setTokenInfo"
          })
        },
        rejected: () => { },
      },
    ),
  }),
  selectors: {
    selectErrorMessage: state => state.errorMessage,
    selectErrorDialogOpen: state => state.errorDialogOpen,
    selectCallDialogOpen: state => state.callDialogOpen,
    selectLiveCall: state => state.liveCall,
    selectTokenInfo: state => state.tokenInfo,
    selectIsLogin: state => state.isLogin,
    selectEmail: state => state.email,
  },
})

export const {
  setEmail,
  clearEmail,
  setTokenInfo,
  setIsLogin,
  setErrorMessage,
  setErrorDialogOpen,
  setCallDialogOpen,
  setLiveCall,
  refreshToken
} = globalSlice.actions

export const { selectEmail, selectErrorMessage, selectErrorDialogOpen, selectCallDialogOpen, selectLiveCall, selectTokenInfo, selectIsLogin } =
  globalSlice.selectors
