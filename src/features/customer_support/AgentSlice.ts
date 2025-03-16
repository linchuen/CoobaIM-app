import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AgentInfo, CustomerAgentInfo } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo, setErrorDialogOpen, setErrorMessage } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchCreateAgent, fetchDisableAgent, fetchSearchAgent } from "../../services/cs/AgentApi"
import type { AgentCreateRequest, AgentDisableRequest, AgentSearchRequest } from "../../services/cs/CsRequestInterface"
import { fetchSearchCustomerAgent } from "../../services/cs/CustomerApi"

type AgentState = {
    agentList: AgentInfo[]
    customerAgents: CustomerAgentInfo[]
}

const initialState: AgentState = {
    agentList: [],
    customerAgents: [],
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
        addBindAgent: create.reducer((state, action: PayloadAction<AgentInfo>) => {
            state.agentList.push(action.payload)
        }),
        removeBindAgent: create.reducer((state, action: PayloadAction<AgentInfo>) => {
            state.agentList.push(action.payload)
        }),
        addAgentThunk: create.asyncThunk(
            async (request: AgentCreateRequest, { getState, dispatch }): Promise<AgentInfo> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchCreateAgent(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
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
            async (request: AgentDisableRequest, { getState, dispatch }): Promise<number> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchDisableAgent(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
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
            async (request: AgentSearchRequest, { getState, dispatch }): Promise<AgentInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchAgent(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
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
        loadCustomerAgents: create.asyncThunk(
            async (request: void, { getState }): Promise<CustomerAgentInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchCustomerAgent(tokenInfo?.token ?? "")
                return response.data.agentInfos;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<CustomerAgentInfo[]>) => {
                    state.customerAgents = action.payload
                },
                rejected: () => { },
            },
        ),
    }),
    selectors: {
        selectAgentList: state => state.agentList,
        selectCustomerAgents: state => state.customerAgents,
    },
})

export const {
    addAgent,
    addAgentThunk,
    diableAgent,
    diableAgentThunk,
    setAgentList,
    loadCustomerAgents
} = agentSlice.actions

export const {
    selectAgentList,
    selectCustomerAgents,
} = agentSlice.selectors
