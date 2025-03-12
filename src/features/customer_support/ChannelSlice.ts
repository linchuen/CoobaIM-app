import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ChannelDeleteResponse, OfficialChannel } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchCreateChannel, fetchDeleteChannel, fetchSearchChannel } from "../../services/cs/Channel"
import type { ChannelCreateRequest, ChannelDeleteRequest } from "../../services/cs/CsRequestInterface"

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
        deleteChannel: create.reducer((state, action: PayloadAction<number>) => {
            const channelId = action.payload
            const channelList = state.channelList
            state.channelList = channelList.filter(channel => channel.id !== channelId)
        }),
        addChannelThunk: create.asyncThunk(
            async (request: ChannelCreateRequest, { getState }): Promise<OfficialChannel> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchCreateChannel(request, tokenInfo?.token ?? "")
                return {
                    id: response.data.channelId,
                    name: request.name,
                    isPublic: request.isPublic ?? false,
                    createdTime: new Date().toLocaleString()
                };
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<OfficialChannel>) => {
                    channelSlice.caseReducers.addChannel(state, {
                        payload: action.payload,
                        type: "addChannel"
                    })
                },
                rejected: () => { },
            },
        ),
        deleteChannelThunk: create.asyncThunk(
            async (request: ChannelDeleteRequest, { getState }): Promise<ChannelDeleteResponse> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchDeleteChannel(request, tokenInfo?.token ?? "")
                return response.data;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<ChannelDeleteResponse>) => {
                    channelSlice.caseReducers.deleteChannel(state, {
                        payload: action.payload.channelId,
                        type: "deleteChannel"
                    })
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
    addChannelThunk,
    deleteChannel,
    deleteChannelThunk,
    setChannelList,
} = channelSlice.actions

export const {
    selectChannelList,
} = channelSlice.selectors
