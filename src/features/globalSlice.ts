import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { LiveCall } from "../services/ResponseInterface"

interface User {
  id: number
  name: string
  email: string
}

interface TokenInfo {
  userId: number
  name: string
  token: string
  platform: string
  ip?: string
  loginTime: string
  expireTime: string
}

interface GlobalState {
  user: User | null
  tokenInfo: TokenInfo | null
  isLogin: boolean
  errorMessage: string
  errorDialogOpen: boolean
  callDialogOpen: boolean,
  liveCall: LiveCall | null,
}

const initialState: GlobalState = {
  user: null,
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
    setUser: create.reducer((state, action: PayloadAction<User>) => {
      state.user = action.payload
    }),
    clearUser: create.reducer(state => {
      state.user = null
    }),
    setTokenInfo: create.reducer((state, action: PayloadAction<TokenInfo>) => {
      console.log("setTokenInfo", action.payload)
      state.tokenInfo = action.payload
    }),
    setIsLogin: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    }),
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
    },
    setErrorDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.errorDialogOpen = action.payload
    },
    setCallDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.callDialogOpen = action.payload
    },
    setLiveCall: (state, action: PayloadAction<LiveCall>) => {
      state.liveCall = action.payload
    },
  }),
  selectors: {
    selectErrorMessage: state => state.errorMessage,
    selectErrorDialogOpen: state => state.errorDialogOpen,
    selectCallDialogOpen: state => state.callDialogOpen,
    selectLiveCall: state => state.liveCall,
    selectTokenInfo: state => state.tokenInfo,
    selectIsLogin: state => state.isLogin,
  },
})

export const {
  setUser,
  clearUser,
  setTokenInfo,
  setIsLogin,
  setErrorMessage,
  setErrorDialogOpen,
  setCallDialogOpen,
  setLiveCall,
} = globalSlice.actions

export const { selectErrorMessage, selectErrorDialogOpen, selectCallDialogOpen, selectLiveCall, selectTokenInfo, selectIsLogin } =
  globalSlice.selectors
