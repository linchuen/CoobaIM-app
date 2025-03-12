import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ChannelDeleteResponse, OfficialChannel } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchDeleteChannel, fetchSearchChannel } from "../../services/cs/Channel"
import type { ChannelDeleteRequest } from "../../services/cs/CsRequestInterface"

type ChannelState = {
    channelList: OfficialChannel[]
}

const initialState: ChannelState = {
    channelList: [],
}

export const channelSlice = createAppSlice({
    name: "channel",
    initialState,
    reducers: create => ({
        addChannel: create.reducer((state, action: PayloadAction<OfficialChannel>) => {
            state.channelList.push(action.payload)
        }),
        deleteChannel: create.asyncThunk(
            async (request: ChannelDeleteRequest, { getState }): Promise<ChannelDeleteResponse> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchDeleteChannel(request, tokenInfo?.token ?? "")
                return response.data;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<ChannelDeleteResponse>) => {
                    const channelId = action.payload.channelId
                    const channelList = state.channelList
                    state.channelList = channelList.filter(channel => channel.id !== channelId)
                },
                rejected: () => { },
            },
        ),
        setChannelList: create.asyncThunk(
            async (request: void, { getState }): Promise<OfficialChannel[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchChannel(tokenInfo?.token ?? "")
                return response.data.channels;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<OfficialChannel[]>) => {
                    state.channelList = action.payload
                },
                rejected: () => { },
            },
        ),
    }),
    selectors: {
        selectChannelList: state => state.channelList,
    },
})

export const {
    addChannel,
    setChannelList,
} = channelSlice.actions

export const {
    selectChannelList,
} = channelSlice.selectors
