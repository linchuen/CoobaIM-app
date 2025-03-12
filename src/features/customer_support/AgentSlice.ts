import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AgentInfo } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchCreateAgent, fetchDisableAgent, fetchSearchAgent } from "../../services/cs/AgentApi"
import type { AgentCreateRequest, AgentDisableRequest, AgentSearchRequest } from "../../services/cs/CsRequestInterface"

type AgentState = {
    agentList: AgentInfo[]
}

const initialState: AgentState = {
    agentList: [],
}

export const agentSlice = createAppSlice({
    name: "agent",
    initialState,
    reducers: create => ({
        addAgent: create.reducer((state, action: PayloadAction<AgentInfo>) => {
            state.agentList.push(action.payload)
        }),
        diableAgent: create.reducer((state, action: PayloadAction<number>) => {
            const agentUserId = action.payload
            const agentList = state.agentList
            state.agentList = agentList.filter(agent => agent.userId === agentUserId)
        }),
        addAgentThunk: create.asyncThunk(
            async (request: AgentCreateRequest, { getState }): Promise<AgentInfo> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchCreateAgent(request, tokenInfo?.token ?? "")
                return {
                    id: response.data.agentId,
                    userId: response.data.userId,
                    isDisable: response.data.isDisable,
                    isDefault: false,
                    name: request.name,
                    department: request.department,
                    createdTime: new Date().toISOString(),
                };
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<AgentInfo>) => {
                    agentSlice.caseReducers.addAgent(state, {
                        payload: action.payload,
                        type: "addAgent"
                    })
                },
                rejected: () => { },
            },
        ),
        diableAgentThunk: create.asyncThunk(
            async (request: AgentDisableRequest, { getState }): Promise<number> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                await fetchDisableAgent(request, tokenInfo?.token ?? "")
                return request.agentUserId;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<number>) => {
                    agentSlice.caseReducers.diableAgent(state, {
                        payload: action.payload,
                        type: "diableAgent"
                    })
                },
                rejected: () => { },
            },
        ),
        setAgentList: create.asyncThunk(
            async (request: AgentSearchRequest, { getState }): Promise<AgentInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchAgent(request, tokenInfo?.token ?? "")
                return response.data.agents;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<AgentInfo[]>) => {
                    state.agentList = action.payload
                },
                rejected: () => { },
            },
        ),
    }),
    selectors: {
        selectAgentList: state => state.agentList,
    },
})

export const {
    addAgent,
    addAgentThunk,
    diableAgent,
    diableAgentThunk,
    setAgentList,
} = agentSlice.actions

export const {
    selectAgentList,
} = agentSlice.selectors
