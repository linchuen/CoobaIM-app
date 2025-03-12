import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export enum PageType {
    chat = "chat",
    dashboard = "dashboard",
    channels = "channels",
    tickets = "tickets",
    routing = "routing",
    users = "users",
    support = "support",
    help = "help",
    setting = "setting"
}

type PageState = {
    selectedPage: PageType
}

const initialState: PageState = {
    selectedPage: PageType.dashboard
}

export const pageSlice = createAppSlice({
    name: "page",
    initialState,
    reducers: create => ({
        switchPage: create.reducer((state, action: PayloadAction<PageType>) => {
            state.selectedPage = action.payload
        }),
    }),
    selectors: {
        selectedPage: state => state.selectedPage,
    },
})

export const {
    switchPage,
} = pageSlice.actions

export const {
    selectedPage,
} = pageSlice.selectors
