import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CustomerInfo } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchSearchCustomer } from "../../services/cs/AgentApi"

type CustomerState = {
    customerList: CustomerInfo[]
}

const initialState: CustomerState = {
    customerList: [],
}

export const customerSlice = createAppSlice({
    name: "customer",
    initialState,
    reducers: create => ({
        addCustomer: create.reducer((state, action: PayloadAction<CustomerInfo>) => {
            state.customerList.push(action.payload)
        }),
        setCustomerList: create.asyncThunk(
            async (request: void, { getState }): Promise<CustomerInfo[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchCustomer(tokenInfo?.token ?? "")
                return response.data?.customerInfos ?? [];
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<CustomerInfo[]>) => {
                    state.customerList = action.payload
                },
                rejected: () => { },
            },
        ),
    }),
    selectors: {
        selectCustomerList: state => state.customerList,
    },
})

export const {
    addCustomer,
    setCustomerList,
} = customerSlice.actions

export const {
    selectCustomerList,
} = customerSlice.selectors
