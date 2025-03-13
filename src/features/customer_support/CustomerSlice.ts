import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CustomerAgentInfo, CustomerInfo } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchBindCustomer, fetchSearchCustomer, fetchUnbindCustomer } from "../../services/cs/AgentApi"
import type { AgentCustomerRequest, CustomerDetailRequest } from "../../services/cs/CsRequestInterface"
import { fetchGetDetails, fetchSearchAgent } from "../../services/cs/CustomerApi"
import type { UserDetail } from "../../services/ResponseInterface"

type CustomerState = {
    customerList: CustomerInfo[]
    agentInfos: CustomerAgentInfo[]
    customerDetailList: UserDetail[]
}

const initialState: CustomerState = {
    customerList: [],
    agentInfos: [],
    customerDetailList: [],
}

export const customerSlice = createAppSlice({
    name: "customer",
    initialState,
    reducers: create => ({
        addCustomer: create.reducer((state, action: PayloadAction<CustomerInfo>) => {
            state.customerList.push(action.payload)
        }),
        deleteCustomer: create.reducer((state, action: PayloadAction<number[]>) => {
            state.customerList = state.customerList.filter(customer => !action.payload.includes(customer.customerUserId))
        }),
        bindCustomer: create.asyncThunk(
            async (request: AgentCustomerRequest, { getState }): Promise<CustomerInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchBindCustomer(request, tokenInfo?.token ?? "")
                return response.data.agentCustomers;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<CustomerInfo[]>) => {
                    action.payload.forEach(customer =>
                        customerSlice.caseReducers.addCustomer(state, {
                            payload: customer,
                            type: "addCustomer"
                        })
                    )
                },
                rejected: () => { },
            },
        ),
        unbindCustomer: create.asyncThunk(
            async (request: AgentCustomerRequest, { getState }): Promise<number[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                await fetchUnbindCustomer(request, tokenInfo?.token ?? "")
                return request.userIds;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<number[]>) => {
                    customerSlice.caseReducers.deleteCustomer(state, {
                        payload: action.payload,
                        type: "deleteCustomer"
                    })
                },
                rejected: () => { },
            },
        ),
        setCustomerList: create.asyncThunk(
            async (request: void, { getState }): Promise<CustomerInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchCustomer(tokenInfo?.token ?? "")
                return response.data.customerInfos;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<CustomerInfo[]>) => {
                    state.customerList = action.payload
                },
                rejected: () => { },
            },
        ),
        setCustomerDetailList: create.asyncThunk(
            async (request: CustomerDetailRequest, { getState }): Promise<UserDetail[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchGetDetails(request, tokenInfo?.token ?? "")
                return response.data.userDetails;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<UserDetail[]>) => {
                    state.customerDetailList = action.payload
                },
                rejected: () => { },
            },
        ),
        loadAgentInfos: create.asyncThunk(
            async (request: void, { getState }): Promise<CustomerAgentInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchAgent(tokenInfo?.token ?? "")
                return response.data.agentInfos;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<CustomerAgentInfo[]>) => {
                    state.agentInfos = action.payload
                },
                rejected: () => { },
            },
        ),
    }),
    selectors: {
        selectCustomerList: state => state.customerList,
        selectAgentList: state => state.agentInfos,
        selectCustomerDetailList: state => state.customerDetailList,
    },
})

export const {
    addCustomer,
    deleteCustomer,
    bindCustomer,
    unbindCustomer,
    setCustomerList,
    setCustomerDetailList,
    loadAgentInfos,
} = customerSlice.actions

export const {
    selectCustomerList,
    selectAgentList,
    selectCustomerDetailList,
} = customerSlice.selectors
