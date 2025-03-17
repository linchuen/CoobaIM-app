import type React from "react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import type { CustomerInfo, OfficialChannel, Ticket } from "../../../../services/cs/CsResponseInterface"
import type { FriendInfo, LiveCall } from "../../../../services/ResponseInterface"
import { WebSocketManager } from "../../../../services/websocketApi"
import { selectTokenInfo, setCallDialogOpen, setLiveCall, setErrorMessage, setErrorDialogOpen } from "../../../globalSlice"
import { addFriend, loadFriends } from "../../../chat/FriendSlice"
import { addChannel, deleteChannel, loadChannels, updateChannel } from "../../ChannelSlice"
import { addBindCustomer, removeBindCustomer } from "../../CustomerSlice"
import { addRecentTicket } from "../../TicketSlice"

const CSAgentWebSocket: React.FC = () => {
  const dispatch = useAppDispatch()
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    const addRecentTicketEvent = (newChannel: Ticket) => {
      dispatch(addRecentTicket(newChannel))
      console.log("addRecentTicketEvent", newChannel)
    }
    const addFriendEvent = (newFriend: FriendInfo) => {
      dispatch(addFriend(newFriend))
      console.log("addFriendEvent", newFriend)
    }
    const addBindCustomerEvent = (bindCustomers: CustomerInfo[]) => {
      dispatch(addBindCustomer(bindCustomers))
      console.log("addBindCustomerEvent", bindCustomers)
    }
    const removeBindCustomerEvent = (bindCustomerIds: number[]) => {
      dispatch(removeBindCustomer(bindCustomerIds))
      console.log("removeBindCustomerEvent", bindCustomerIds)
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

      webSocket.subscribe<Ticket>("/user/queue/ticket_add", addRecentTicketEvent)
      webSocket.subscribe<OfficialChannel>("/topic/channel_add", addChannelEvent)
      webSocket.subscribe<OfficialChannel>("/topic/channel_update", updateChannelEvent)
      webSocket.subscribe<number>("/topic/channel_delete", deleteChannelEvent)
      webSocket.subscribe<FriendInfo>("/user/queue/friend_add", addFriendEvent)
      webSocket.subscribe<CustomerInfo[]>("/user/queue/bind_customer_add", addBindCustomerEvent)
      webSocket.subscribe<number[]>("/user/queue/bind_customer_remove", removeBindCustomerEvent)
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
