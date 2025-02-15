export interface ApplyFriendResponse {
    /** 申請ID */
    applyId: number;
}

export interface FriendSearchResponse {
    friends: FriendInfo[];
}

export interface FriendInfo {
    /** ID */
    id: number;
    
    /** 使用者ID */
    userId: number;
    
    /** 朋友使用者ID */
    friendUserId: number;
    
    /** 顯示名稱 */
    showName: string;
}

export interface BuildRoomResponse {
    /** 房間ID */
    roomId: number;
}

export interface DestroyRoomResponse {
    /** 房間ID */
    roomId: number;
}

export interface LoginResponse {
    /** 使用者ID */
    userId: number;

    /** 登入Token */
    token: string;

    /** 平台 */
    platform: string;

    /** IP 地址 */
    ip?: string;

    /** 登入時間 */
    loginTime: string;

    /** 過期時間 */
    expireTime: string;
}

export interface LogoutResponse {
    /** 登出時間 */
    logoutTime: string;
}

export interface RegisterResponse {
    /** 使用者ID */
    userId: number;
}

export interface RoomResponse {
    /** 房間ID */
    roomId: number;

    /** 使用者ID */
    userId: number;
}

export interface RoomInfo {
    /** 房間ID */
    id: number;

    /** 房間名稱 */
    name: string;
}

export interface RoomSearchResponse{
    rooms: RoomInfo[];
}

export interface ApiResponse<T> {
    traceId: string
    code: number
    errorMessage?: string
    data?: T
}