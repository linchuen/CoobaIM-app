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

export interface FriendSearchRequest {
    /** 刪除用戶ID */
    friendUserIds: number[];
}

export interface LoginRequest {
    /** 電子郵件 */
    email: string;

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