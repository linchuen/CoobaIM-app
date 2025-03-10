import type React from "react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"

import { selectTokenInfo, setCallDialogOpen, setErrorDialogOpen, setErrorMessage, setLiveCall } from "../../globalSlice"
import type { FriendInfo, LiveCall } from "../../../services/ResponseInterface"
import { WebSocketManager } from "../../../services/websocketApi"
import { addFriend, addRoom, loadChannels, loadFriends } from "../CustomerPageSlice"
import type { OfficialChannel } from "../../../services/cs/CsResponseInterface"


const CSWebSocket: React.FC = () => {
  const dispatch = useAppDispatch()
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    const addFriendEvent = (newFriend: FriendInfo) => {
      dispatch(addFriend(newFriend))
      console.log("addFriendEvent", newFriend)
    }
    const addChannelEvent = (newChannel: OfficialChannel) => {
      dispatch(addRoom(newChannel))
      console.log("addChannelEvent", newChannel)
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
      dispatch(loadChannels(null))

      webSocket.subscribe<OfficialChannel>("/topic/channel", addChannelEvent)
      webSocket.subscribe<FriendInfo>("/user/queue/friend_add", addFriendEvent)
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

export default CSWebSocket

