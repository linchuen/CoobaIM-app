import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

interface User {
  id: number
  name: string
  email: string
}

interface GlobalState {
  user: User | null
}

const initialState: GlobalState = {
  user: null,
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
  }),
})

export const { setUser, clearUser } = globalSlice.actions
