import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
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

const chatSlice = createSlice({
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
                    state.firendInfoList = action.payload ?? []
                },
                rejected: state => {
                    state.status = "failed"
                },
            },
        )
    })
});

export const { loadFriends } = chatSlice.actions;

export default chatSlice.reducer;
