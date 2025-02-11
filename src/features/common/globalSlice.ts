import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

interface User {
  id: number
  name: string
  email: string
}

interface TokenInfo {
  userId: number
  token: string
  platform: string
  ip?: string
  loginTime: string
  expireTime: string
}

interface GlobalState {
  user: User | null
  tokenInfo: TokenInfo | null
  errorMessage: string
  errorDialogOpen: boolean
}

const initialState: GlobalState = {
  user: null,
  tokenInfo: null,
  errorMessage: "",
  errorDialogOpen: false,
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
      state.tokenInfo = action.payload
    }),
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
    },
    setErrorDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.errorDialogOpen = action.payload
    },
  }),
  selectors: {
    selectErrorMessage: state => state.errorMessage,
    selectErrorDialogOpen: state => state.errorDialogOpen,
  },
})

export const {
  setUser,
  clearUser,
  setTokenInfo,
  setErrorMessage,
  setErrorDialogOpen,
} = globalSlice.actions

export const { selectErrorMessage, selectErrorDialogOpen } = globalSlice.selectors
