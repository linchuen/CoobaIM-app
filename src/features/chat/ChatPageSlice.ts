import { createSlice } from "@reduxjs/toolkit";
import type { FriendInfo } from "../../services/ResponseInterface";
import { fetchSearchFriend } from "../../services/FriendApi";

type FriendState = {
    firendInfoList: FriendInfo[];
    status: string
};

const initialState: FriendState = {
    firendInfoList: [],
    status: ""
};

export const chatPageSlice = createSlice({
    name: "chat",
    initialState,
    reducers: create => ({
        loadFriends: create.asyncThunk(async (friendUserIds: number[]) => {
            const response = await fetchSearchFriend({ friendUserIds: friendUserIds })
            return response.data
        },
            {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action) => {
                    state.status = "idle"
                    state.firendInfoList = action.payload?.friends ?? []
                },
                rejected: state => {
                    state.status = "failed"
                },
            },
        )
    }),
    selectors: {
        selectFirendInfoList: state => state.firendInfoList,
        selectStatus: state => state.status,
    },
});

export const { loadFriends } = chatPageSlice.actions;
export const { selectFirendInfoList, selectStatus } = chatPageSlice.selectors
