import type { FriendInfo } from "../../services/ResponseInterface";
import { fetchSearchFriend } from "../../services/FriendApi";
import { createAppSlice } from "../../app/createAppSlice";

type FriendState = {
    firendInfoList: FriendInfo[];
    status: string
};

const initialState: FriendState = {
    firendInfoList: [],
    status: ""
};

export const chatSlice = createAppSlice({
    name: "chat",
    initialState,
    reducers: create => ({
        loadFriends: create.asyncThunk(
            async (friendUserIds: number[]) => {
                const response = await fetchSearchFriend({ friendUserIds: friendUserIds })
                return response.data?.friends
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
    }),
    selectors: {
        selectFirendInfoList: state => state.firendInfoList,
        selectStatus: state => state.status,
    },
});

export const { loadFriends } = chatSlice.actions;

export const { selectFirendInfoList, selectStatus } = chatSlice.selectors

export default chatSlice.reducer;
