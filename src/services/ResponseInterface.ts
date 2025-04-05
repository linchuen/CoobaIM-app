export interface ApplyFriendResponse {
  applyId: number
}

export interface PermitFriendResponse {
  roomId: number
}

export interface FriendSearchResponse {
  friends: FriendInfo[]
}

export interface UserDetailResponse{
  userDetail: UserDetail
}

export interface UserDetail {
  userId: number
  name: string
  email: string
  tags?: string
  remark?: string
  createdTime: string
}

export interface FriendInfo {
  userId: number
  friendUserId: number
  showName: string
  roomId: number,
  avatar?: string
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
  role: string
  avatar?: string
  platform: string
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
  avatar?: string
}

export interface RoomSearchResponse {
  rooms: RoomInfo[]
}

export interface RoomUser {
  id: number
  roomId: number
  userId: number
  showName: string
  avatar?: string
}

export interface RoomMemberResponse {
  roomUsers: RoomUser[]
}

export interface ChatInfo {
  uuid?: string,
  id: number
  name: string
  roomId: number
  userId: number
  message: string
  url?: string
  type: string
  success?: boolean | undefined
  createdTime: string
}

export interface ChatLoadResponse {
  chats: ChatInfo[]
}

export interface UploadFileResponse {
  fileName: string
  url: string
}

export interface LiveCall {
  roomId: number
  roomName: string
  passcode: string
  token: string,
  type: string
}

export interface LastChatAndUnRead {
  roomId: number
  chat: ChatInfo
  unread: number
}

export interface ChatLoadLastAndUnReadResponse {
  chatAndUnReads: LastChatAndUnRead[]
}

export interface ApiResponse<T> {
  traceId: string
  code: number
  errorMessage?: string
  data: T
}
