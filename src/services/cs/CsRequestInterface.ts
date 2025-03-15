export interface AgentCustomerRequest {
    userIds: number[];
}

export interface AgentCreateRequest {
    name: string;
    password: string;
    email: string;
    department: string;
}

export interface AgentDisableRequest{
    agentUserId: number;
}

export interface AgentSearchRequest {
    agentIds?: number[];
}

export interface AgentUpdateRequest {
    agentUserId?: number;
    isDisable?: boolean;
}

export interface ChannelCreateRequest {
    name: string;
    isPublic?: boolean;
}

export interface ChannelUpdateRequest {
    channelId: number,
    name: string;
    isPublic?: boolean;
}

export interface ChannelDeleteRequest {
    channelId: number;
}

export interface CustomerEnterRequest {
    channelId: number;
    isUsePreviousChat?: boolean;
}

export interface CustomerTicketSearchRequest {
    customerUserId: number;
}

export interface CustomerDetailRequest{
    userIds: number[]
}

export interface TicketTransferRequest {
    transferUserId: number;
    roomId: number;
}