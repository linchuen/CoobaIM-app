export interface FriendRequest {
    applyUserId: number;
    permitUserId: number;
    isPermit?: boolean;
}

export interface FriendRemoveRequest {
    friendUserId: number;
}

export interface FriendSearchRequest {
    friendUserIds: number[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LogoutRequest {
    userId: number;
}

export interface MessageRequest {
    msg?: string;
    uid?: string;
    groupId?: string;
}

export interface RegisterRequest {
    name: string;
    password: string;
    email: string;
}

export interface RoomRequest {
    roomId?: number;
    name?: string;
    userIds?: number[];
}

export interface RoomUserRequest {
    roomId: number;
    userId: number;
}

export interface RoomSearchRequest {
    roomIds: number[];
    name?: string;
}

export interface SpeakRequest {
    roomId: number;
    userId: number,
    message: string;
    url?: string;
    type?: string;
}

export interface ChatLoadRequest {
    roomId: number;
}