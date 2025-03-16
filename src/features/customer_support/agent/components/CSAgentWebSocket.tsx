import type React from "react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import type { OfficialChannel } from "../../../../services/cs/CsResponseInterface"
import type { FriendInfo, LiveCall } from "../../../../services/ResponseInterface"
import { WebSocketManager } from "../../../../services/websocketApi"
import { selectTokenInfo, setCallDialogOpen, setLiveCall, setErrorMessage, setErrorDialogOpen } from "../../../globalSlice"
import { addFriend, loadFriends } from "../../../chat/FriendSlice"
import { addChannel, deleteChannel, loadChannels, updateChannel } from "../../ChannelSlice"

const CSAgentWebSocket: React.FC = () => {
  const dispatch = useAppDispatch()
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    const addFriendEvent = (newFriend: FriendInfo) => {
      dispatch(addFriend(newFriend))
      console.log("addFriendEvent", newFriend)
    }
    const addBindCustomerEvent = (newChannel: OfficialChannel) => {
      dispatch(addChannel(newChannel))
      console.log("addBindCustomerEvent", newChannel)
    }
    const removeBindCustomerEvent = (newChannel: OfficialChannel) => {
      dispatch(addChannel(newChannel))
      console.log("removeBindCustomerEvent", newChannel)
    }
    const addChannelEvent = (newChannel: OfficialChannel) => {
      dispatch(addChannel(newChannel))
      console.log("addChannelEvent", newChannel)
    }
    const updateChannelEvent = (channel: OfficialChannel) => {
      dispatch(updateChannel(channel))
      console.log("ipdateChannelEvent", channel)
    }
    const deleteChannelEvent = (channelId: number) => {
      dispatch(deleteChannel(channelId))
      console.log("deleteChannelEvent", channelId)
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
      dispatch(loadChannels())

      webSocket.subscribe<OfficialChannel>("/topic/channel_add", addChannelEvent)
      webSocket.subscribe<OfficialChannel>("/topic/channel_update", updateChannelEvent)
      webSocket.subscribe<number>("/topic/channel_delete", deleteChannelEvent)
      webSocket.subscribe<FriendInfo>("/user/queue/friend_add", addFriendEvent)
      webSocket.subscribe<OfficialChannel>("/user/queue/bind_customer_add", addBindCustomerEvent)
      webSocket.subscribe<OfficialChannel>("/user/queue/bind_customer_remove", removeBindCustomerEvent)
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

export default CSAgentWebSocket
