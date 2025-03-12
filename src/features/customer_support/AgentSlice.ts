import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AgentInfo } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchSearchAgent } from "../../services/cs/AgentApi"
import type { AgentSearchRequest } from "../../services/cs/CsRequestInterface"

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
    setAgentList,
} = agentSlice.actions

export const {
    selectAgentList,
} = agentSlice.selectors
