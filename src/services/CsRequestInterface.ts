export interface AgentCustomerRequest {
    userIds: number[];
}

export interface AgentCreateRequest {
    name: string;
    password: string;
    email: string;
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

export interface ChannelDeleteRequest {
    channelId: number;
}

export interface CustomerEnterRequest {
    roomId: number;
    isUsePreviousChat?: boolean;
}

export interface CustomerTicketSearchRequest {
    customerUserId: number;
}
