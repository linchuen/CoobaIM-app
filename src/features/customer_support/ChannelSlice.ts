import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { ChannelDeleteResponse, OfficialChannel } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo, setErrorDialogOpen, setErrorMessage } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchCreateChannel, fetchDeleteChannel, fetchSearchChannel, fetchUpdateChannel } from "../../services/cs/Channel"
import type { ChannelCreateRequest, ChannelDeleteRequest, ChannelUpdateRequest } from "../../services/cs/CsRequestInterface"

type ChannelState = {
    channelList: OfficialChannel[]
    channelLoaded: number[]
}

const initialState: ChannelState = {
    channelList: [],
    channelLoaded: [],
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
            async (request: ChannelCreateRequest, { getState, dispatch }): Promise<OfficialChannel> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchCreateChannel(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
                return {
                    id: response.data.channelId,
                    name: request.name,
                    isPublic: request.isPublic ?? false,
                    createdTime: new Date().toISOString()
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
        updateChannelThunk: create.asyncThunk(
            async (request: ChannelUpdateRequest, { getState, dispatch }): Promise<OfficialChannel> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchUpdateChannel(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
                return {
                    id: request.channelId,
                    name: request.name,
                    isPublic: request.isPublic ?? false,
                    createdTime: new Date().toISOString()
                };
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<OfficialChannel>) => {
                    const updateChannel = action.payload
                    let channel = state.channelList.find(channel => channel.id === updateChannel.id);
                    if (channel) {
                        channel.isPublic = updateChannel.isPublic;
                    }
                },
                rejected: () => { },
            },
        ),
        deleteChannelThunk: create.asyncThunk(
            async (request: ChannelDeleteRequest, { getState, dispatch }): Promise<ChannelDeleteResponse> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchDeleteChannel(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
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
        loadChannels: create.asyncThunk(
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
        setChannelLoaded: create.reducer((state, action: PayloadAction<number>) => {
            state.channelLoaded.push(action.payload)
        },
        ),
    }),
    selectors: {
        selectChannelList: state => state.channelList,
        selectChannelLoaded: state => state.channelLoaded,
    },
})

export const {
    addChannel,
    addChannelThunk,
    updateChannelThunk,
    deleteChannel,
    deleteChannelThunk,
    loadChannels,
    setChannelLoaded,
} = channelSlice.actions

export const {
    selectChannelList,
    selectChannelLoaded,
} = channelSlice.selectors
