export interface FriendRequest {
    /** 申請用戶ID */
    applyUserId: number;

    /** 批准用戶ID */
    permitUserId: number;

    /** 是否允許 */
    isPermit?: boolean;
}

export interface FriendRemoveRequest {
    /** 刪除用戶ID */
    friendUserId: number;
}

export interface LoginRequest {
    /** 使用者ID */
    userId: number;

    /** 密碼 */
    password: string;
}

export interface LogoutRequest {
    /** 使用者ID */
    userId: number;
}

export interface MessageRequest {
    /** 訊息內容 */
    msg?: string;

    /** 使用者ID */
    uid?: string;

    /** 群組ID */
    groupId?: string;
}

export interface RegisterRequest {
    /** 使用者名稱 */
    name: string;

    /** 密碼 */
    password: string;

    /** 電子郵件 */
    email: string;
}

export interface RoomRequest {
    /** 房間ID */
    roomId?: number;

    /** 房間名稱 */
    name?: string;
}

export interface RoomUserRequest {
    /** 房間ID */
    roomId: number;

    /** 使用者ID */
    userId: number;
}

export interface SpeakRequest {
    /** 房間ID */
    roomId?: number;

    /** 訊息內容 */
    message?: string;
}

export interface ApplyFriendResponse {
    /** 申請ID */
    applyId: number;
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
    ip: string;

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

export interface ApiResponse<T> {
    traceId: string
    code: number
    errorMessage?: string
    data?: T
}