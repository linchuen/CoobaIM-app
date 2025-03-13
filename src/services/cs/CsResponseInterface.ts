import type { ChatInfo, UserDetail } from "../ResponseInterface";

export interface AgentCreateResponse {
    agentId: number;
    userId: number;
    isDisable: boolean;
    createdTime: string;
}


export interface Agent {
    id: number;
    userId: number;
    isDisable: boolean;
    isDefault: boolean;
    createdTime: string;
    updatedTime: string;
}
export interface AgentInfo {
    id: number;
    userId: number;
    isDisable: boolean;
    isDefault: boolean;
    name: string;
    department: string;
    createdTime: string;
}

export interface AgentSearchResponse {
    agents: AgentInfo[];
}

export interface ChannelCreateResponse {
    channelId: number;
}

export interface OfficialChannel {
    id: number;
    name: string;
    isPublic: boolean;
    createdTime: string;
}

export interface ChannelSearchResponse {
    channels: OfficialChannel[];
}

export interface ChannelDeleteResponse {
    channelId: number;
}

export interface CustomerEnterResponse {
    ticket: Ticket;
}

export interface CustomerBindResponse {
    agentCustomers: CustomerInfo[];
}

export interface CustomerInfo {
    agentUserId: number;
    customerUserId: number;
    name: string;
    roomId: number;
}

export interface CustomerSearchResponse {
    customerInfos: CustomerInfo[];
}

export interface Ticket {
    id: number;
    name: string;
    roomId: number;
    agentUserId: number;
    customerUserId: number;
    isOpen: boolean;
    createdTime: string;
}


export interface CustomerTicketSearchResponse {
    tickets: Ticket[];
}

export interface TicketSearchResponse {
    tickets: Ticket[];
}

export interface TicketTransferResponse {
    roomId: number;
    userId: number;
    showName: string;
}

export interface CustomerAgentInfo {
    agentId: number;
    agentUserId: number;
    roomId: number;
    name: string;
    department: string;
}

export interface CustomerAgentSearchResponse {
    agentInfos: CustomerAgentInfo[]
}

export interface CustomerDetailResponse{
    userDetails: UserDetail[]
}
