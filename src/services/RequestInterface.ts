export interface FriendRequest {
    applyUserId: number;
    permitUserId: number;
    isPermit?: boolean;
}

export interface FriendApplyRequest {
    applyUserId: number;
    permitUserName: string;
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
    platform: string;
}

export interface RefreshRequest {
    platform: string;
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
    uuid: string;
    roomId: number;
    userId: number,
    message: string;
    url?: string;
    type?: string;
}

export interface ChatLoadRequest {
    roomId: number;
    chatId?: string;
    searchAfter?: boolean;
}

export interface ChatLoadLastAndUnReadRequest{
    roomIds: number[];
}

export interface LiveBuildRequest {
    roomId: number;
    passcode?: string;
    type: string;
}

export interface ParticipantTokenRequest {
    name: string;
    identity: string;
    roomName: string;
    passcode: string;
}

export interface ChatIsReadRequest{
    roomId: number;
    chatId: string;
}

export interface ChatLoadDateRequest{
    roomId: number;
    date?: string;
    startTime?: string;
    endTime?: string;
    dateBefore?: boolean;
}

export interface ChatSearchRequest{
    roomId: number;
    word: string;
}