import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CustomerInfo } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo, setErrorDialogOpen, setErrorMessage } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchBindCustomer, fetchSearchBindCustomer, fetchsearchBindCustomerDetail, fetchUnbindCustomer } from "../../services/cs/AgentApi"
import type { AgentCustomerRequest, BindCustomerSearchRequest, CustomerDetailRequest } from "../../services/cs/CsRequestInterface"
import { fetchGetDetails } from "../../services/cs/CustomerApi"
import type { UserDetail } from "../../services/ResponseInterface"

type CustomerState = {
    customerUserId: number | null
    customerDetail: UserDetail
    bindCustomerList: CustomerInfo[]
    customerDetailList: UserDetail[]
}

const initialState: CustomerState = {
    customerUserId: null,
    customerDetail: {
        userId: 0,
        name: "",
        email: ""
    },
    bindCustomerList: [],
    customerDetailList: [],
}

export const customerSlice = createAppSlice({
    name: "customer",
    initialState,
    reducers: create => ({
        addBindCustomer: create.reducer((state, action: PayloadAction<CustomerInfo[]>) => {
            action.payload.forEach(customer => state.bindCustomerList.push(customer))

        }),
        removeBindCustomer: create.reducer((state, action: PayloadAction<number[]>) => {
            state.bindCustomerList = state.bindCustomerList.filter(customer => !action.payload.includes(customer.customerUserId))
        }),
        setCustomerUserId: create.reducer((state, action: PayloadAction<number | null>) => {
            state.customerUserId = action.payload
        }),
        bindCustomerThunk: create.asyncThunk(
            async (request: AgentCustomerRequest, { getState, dispatch }): Promise<CustomerInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchBindCustomer(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
                return response.data.agentCustomers;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<CustomerInfo[]>) => {

                },
                rejected: () => { },
            },
        ),
        unbindCustomerThunk: create.asyncThunk(
            async (request: AgentCustomerRequest, { getState, dispatch }): Promise<number[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchUnbindCustomer(request, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
                return request.userIds;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<number[]>) => {

                },
                rejected: () => { },
            },
        ),
        loadBindCustomerList: create.asyncThunk(
            async (request: void, { getState, dispatch }): Promise<CustomerInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchBindCustomer({}, tokenInfo?.token ?? "")
                if (response.errorMessage) {
                    dispatch(setErrorMessage(response.errorMessage))
                    dispatch(setErrorDialogOpen(true))
                }
                return response.data.customerInfos;
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<CustomerInfo[]>) => {
                    state.bindCustomerList = action.payload
                },
                rejected: () => { },
            },
        ),
        setCustomerDetailList: create.asyncThunk(
            async (request: BindCustomerSearchRequest, { getState }): Promise<UserDetail[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchsearchBindCustomerDetail(request, tokenInfo?.token ?? "")
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
        loadCustomerDetail: create.asyncThunk(
            async (request: CustomerDetailRequest, { getState }): Promise<UserDetail> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchGetDetails(request, tokenInfo?.token ?? "")
                return response.data.userDetails[0];
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<UserDetail>) => {
                    state.customerDetail = action.payload
                },
                rejected: () => { },
            },
        ),

    }),
    selectors: {
        selectCustomerUserId: state => state.customerUserId,
        selectBindCustomerList: state => state.bindCustomerList,
        selectCustomerDetailList: state => state.customerDetailList,
        selectCurrentCustomerDetail: state => state.customerDetail,
    },
})

export const {
    addBindCustomer,
    removeBindCustomer,
    setCustomerUserId,
    bindCustomerThunk,
    unbindCustomerThunk,
    loadBindCustomerList,
    setCustomerDetailList,
    loadCustomerDetail,
} = customerSlice.actions

export const {
    selectBindCustomerList,
    selectCustomerDetailList,
    selectCustomerUserId,
    selectCurrentCustomerDetail,
} = customerSlice.selectors
