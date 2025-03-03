import type React from "react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  addFriend,
  addFriendApply,
  addRoom,
  loadFriendApply,
  loadFriends,
  loadGroups,
} from "../ChatPageSlice"
import { selectTokenInfo, setCallDialogOpen, setErrorDialogOpen, setErrorMessage, setLiveCall } from "../../globalSlice"
import type { FriendApplyInfo, FriendInfo, LiveCall, RoomInfo } from "../../../services/ResponseInterface"
import { WebSocketManager } from "../../../services/websocketApi"
import type { IMessage } from "@stomp/stompjs"


const WebSocket: React.FC = () => {
  const dispatch = useAppDispatch()
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    const addFriendApplyEvent = (message: IMessage) => {
      const newFriendApply = JSON.parse(message.body) as FriendApplyInfo
      dispatch(addFriendApply(newFriendApply))
      console.log("addFriendApplyEvent", newFriendApply)
    }
    const addFriendEvent = (message: IMessage) => {
      const newFriend = JSON.parse(message.body) as FriendInfo
      dispatch(addFriend(newFriend))
      console.log("addFriendEvent", newFriend)
    }
    const addRoomEvent = (message: IMessage) => {
      const newRoom = JSON.parse(message.body) as RoomInfo
      dispatch(addRoom(newRoom))
      console.log("addRoomEvent", newRoom)
    }
    const addCallEvent = (message: IMessage) => {
      const newCall = JSON.parse(message.body) as LiveCall
      dispatch(setCallDialogOpen(true))
      dispatch(setLiveCall(newCall))
      console.log("addCallEvent", newCall)
    }
    const addErrorEvent = (message: IMessage) => {
      dispatch(setErrorMessage(message.body))
      dispatch(setErrorDialogOpen(false))
    }
    const loadData = (webSocket: WebSocketManager) => {
      dispatch(loadFriends({ friendUserIds: [] }))
      dispatch(loadGroups({ roomIds: [] }))
      dispatch(loadFriendApply(null))

      webSocket.subscribe("/user/queue/friend_apply", addFriendApplyEvent)
      webSocket.subscribe("/user/queue/friend_add", addFriendEvent)
      webSocket.subscribe("/user/queue/room_add", addRoomEvent)
      webSocket.subscribe("/user/queue/live_call", addCallEvent)
      webSocket.subscribe("/user/queue/error", addErrorEvent)
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

