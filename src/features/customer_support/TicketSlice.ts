import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Ticket } from "../../services/cs/CsResponseInterface"
import { selectTokenInfo } from "../globalSlice"
import type { RootState } from "../../app/store"
import { fetchSearchCustomerTicket, fetchSearchRecentTicket } from "../../services/cs/AgentApi"
import type { CustomerTicketSearchRequest } from "../../services/cs/CsRequestInterface"

type TicketState = {
    recentTicketLsit: Ticket[]
    customerTicketLsit: Ticket[]
}

const initialState: TicketState = {
    recentTicketLsit: [],
    customerTicketLsit: [],
}

export const ticketSlice = createAppSlice({
    name: "ticket",
    initialState,
    reducers: create => ({
        addRecentTicket: create.reducer((state, action: PayloadAction<Ticket>) => {
            state.recentTicketLsit.push(action.payload)
        }),
        setRecentTicket: create.asyncThunk(
            async (request: void, { getState }): Promise<Ticket[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchRecentTicket(tokenInfo?.token ?? "")
                return response.data?.tickets ?? [];
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<Ticket[]>) => {
                    state.recentTicketLsit = action.payload
                },
                rejected: () => { },
            },
        ),
        setCustomerTicket: create.asyncThunk(
            async (request: CustomerTicketSearchRequest, { getState }): Promise<Ticket[]> => {
                const state = getState() as RootState
                const tokenInfo = selectTokenInfo(state)
                const response = await fetchSearchCustomerTicket(request, tokenInfo?.token ?? "")
                return response.data?.tickets ?? [];
            },
            {
                pending: () => { },
                fulfilled: (state, action: PayloadAction<Ticket[]>) => {
                    state.recentTicketLsit = action.payload
                },
                rejected: () => { },
            },
        ),
    }),
    selectors: {
        selectRecentTicketLsit: state => state.recentTicketLsit,
        selectCustomerTicketLsit: state => state.customerTicketLsit,
    },
})

export const {
    addRecentTicket,
    setRecentTicket,
    setCustomerTicket,
} = ticketSlice.actions

export const {
    selectRecentTicketLsit,
    selectCustomerTicketLsit,
} = ticketSlice.selectors
