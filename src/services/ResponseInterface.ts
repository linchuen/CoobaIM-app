export interface ApplyFriendResponse {
  applyId: number
}

export interface PermitFriendResponse {
  roomId: number
}

export interface FriendSearchResponse {
  friends: FriendInfo[]
}

export interface FriendInfo {
  userId: number
  friendUserId: number
  showName: string
  roomId: number
}

export interface FriendApplySearchResponse {
  applicants: FriendApplyInfo[]
}

export interface FriendApplyInfo {
  id: number
  applyId: number
  name: string
}

export interface BuildRoomResponse {
  roomId: number
}

export interface DestroyRoomResponse {
  roomId: number
}

export interface LoginResponse {
  userId: number
  name: string
  token: string
  platform: string
  ip?: string
  loginTime: string
  expireTime: string
}

export interface LogoutResponse {
  logoutTime: string
}

export interface RegisterResponse {
  userId: number
}

export interface RoomResponse {
  roomId: number
  userId: number
}

export interface RoomInfo {
  id: number
  name: string
}

export interface RoomSearchResponse {
  rooms: RoomInfo[]
}

export interface ChatInfo {
  id: number
  name: string
  roomId: number
  userId: number
  message: string
  type: string
  success: boolean | undefined
}

export interface ChatLoadResponse {
  chats: ChatInfo[]
}

export interface ApiResponse<T> {
  traceId: string
  code: number
  errorMessage?: string
  data?: T
}
