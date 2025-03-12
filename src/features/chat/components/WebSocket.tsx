import type React from "react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  addRoom,
  loadGroups,
} from "../ChatPageSlice"
import { selectTokenInfo, setCallDialogOpen, setErrorDialogOpen, setErrorMessage, setLiveCall } from "../../globalSlice"
import type { FriendApplyInfo, FriendInfo, LiveCall, RoomInfo } from "../../../services/ResponseInterface"
import { WebSocketManager } from "../../../services/websocketApi"
import { addFriend, addFriendApply, loadFriendApply, loadFriends } from "../FriendSlice"


const WebSocket: React.FC = () => {
  const dispatch = useAppDispatch()
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    const addFriendApplyEvent = (newFriendApply: FriendApplyInfo) => {
      dispatch(addFriendApply(newFriendApply))
      console.log("addFriendApplyEvent", newFriendApply)
    }
    const addFriendEvent = (newFriend: FriendInfo) => {
      dispatch(addFriend(newFriend))
      console.log("addFriendEvent", newFriend)
    }
    const addRoomEvent = (newRoom: RoomInfo) => {
      dispatch(addRoom(newRoom))
      console.log("addRoomEvent", newRoom)
    }
    const addCallEvent = (newCall: LiveCall) => {
      dispatch(setCallDialogOpen(true))
      dispatch(setLiveCall(newCall))
      console.log("addCallEvent", newCall)
    }
    const addErrorEvent = (message: string) => {
      dispatch(setErrorMessage(message))
      dispatch(setErrorDialogOpen(false))
    }
    const loadData = (webSocket: WebSocketManager) => {
      dispatch(loadFriends({ friendUserIds: [] }))
      dispatch(loadGroups({ roomIds: [] }))
      dispatch(loadFriendApply(null))

      webSocket.subscribe<FriendApplyInfo>("/user/queue/friend_apply", addFriendApplyEvent)
      webSocket.subscribe<FriendInfo>("/user/queue/friend_add", addFriendEvent)
      webSocket.subscribe<RoomInfo>("/user/queue/room_add", addRoomEvent)
      webSocket.subscribe<LiveCall>("/user/queue/live_call", addCallEvent)
      webSocket.subscribe<string>("/user/queue/error", addErrorEvent)
    }

    if (tokenInfo) {
      const webSocket = WebSocketManager.getInstance()
      webSocket.disconnect()
      webSocket.connect(tokenInfo.userId, tokenInfo.token, () => loadData(webSocket))
    }
  }, [dispatch, tokenInfo])

  return (
    <></>
  )
}

export default WebSocket

