import type { ChatInfo } from "./ResponseInterface";

export interface AgentCreateResponse {
    agentId: number;
    userId: number;
    isDisable: boolean;
    createdTime: string; // LocalDateTime 轉換為 ISO 8601 字符串
}


export interface Agent {
    id: number;
    userId: number;
    isDisable: boolean;
    isDefault: boolean;
    createdTime: string; // LocalDateTime 轉換為 ISO 8601 格式的字符串
    updatedTime: string; // LocalDateTime 轉換為 ISO 8601 格式的字符串
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
    createdTime: string; // LocalDateTime 轉換為 ISO 8601 格式的字符串
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
    createdTime: string; // LocalDateTime 轉換為 ISO 8601 格式的字符串
}


export interface CustomerTicketSearchResponse {
    tickets: Ticket[];
}
