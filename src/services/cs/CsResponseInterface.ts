import type { ChatInfo } from "../ResponseInterface";

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

export interface AgentSearchResponse {
    agents: Agent[];
}

export interface ChannelCreateResponse {
    channelId: number;
}

export interface OfficialChannel {
    id: number;
    name: string;
    isPublic: boolean;
}

export interface ChannelSearchResponse {
    channels: OfficialChannel[];
}

export interface CustomerEnterResponse {
    ticket: Ticket;
    chats: ChatInfo[];
}

export interface CustomerInfo {
    agentCustomerId: number;
    customerUserId: number;
    name: string;
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

export interface TicketTransferResponse {
    roomId: number;
    userId: number;
    showName: string;
}
