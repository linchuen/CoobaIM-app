import type React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import type { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";
import CSWebSocket from "./components/CSWebSocket";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChatType } from "../../../services/constant";
import { WebSocketManager } from "../../../services/websocketApi";
import { selectTokenInfo } from "../../globalSlice";
import type { CustomerEnterResponse, OfficialChannel } from "../../../services/cs/CsResponseInterface";
import { handleFetch } from "../../../services/common";
import { selectRoomSubscribeSet, subscribeGroups, setCurrentRoomId, setCurrentRoomName, loadChats, setChatType } from "../../chat/ChatPageSlice";
import { selectChannelList, selectChannelLoaded } from "../ChannelSlice";
import { fetchEnterRoom } from "../../../services/cs/CustomerApi";
import { selectCustomerAgents } from "../AgentSlice";
import type { ChatInfo } from "../../../services/ResponseInterface";

const CustomerPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const agentInfos = useAppSelector(selectCustomerAgents)
  const channelInfos = useAppSelector(selectChannelList)
  const roomSubscribeSet = useAppSelector(selectRoomSubscribeSet)
  const channelLoadedSet = useAppSelector(selectChannelLoaded)
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    if (agentInfos.length === 0 || !tokenInfo) return

    const stompClient = WebSocketManager.getInstance()
    agentInfos.forEach(agentInfo => {
      const roomId = agentInfo.roomId
      if (roomSubscribeSet.includes(roomId)) return

      stompClient.subscribe<ChatInfo>(("/group/" + roomId), (newChat: ChatInfo) => {
        dispatch(subscribeGroups({ userId: tokenInfo.userId, roomId: roomId, newChat: newChat }))
      })
    })

  }, [dispatch, agentInfos, roomSubscribeSet, tokenInfo])

  const handleEnterChannel = async (channel: OfficialChannel) => {
    if (!tokenInfo) return
    await handleFetch<CustomerEnterResponse>(
      dispatch,
      fetchEnterRoom({
        channelId: channel.id,
        isUsePreviousChat: !channel.isPublic && !channelLoadedSet.includes(channel.id)
      }, tokenInfo.token),
      data => {
        const ticket = data.ticket
        handleLoadChat(ticket.roomId, ticket.name, ChatType.ToRoom)
      },
    )

  }

  const handleLoadChat = (roomId: number, name: string, type: ChatType) => {
    dispatch(setChatType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(setCurrentRoomName(name))
    dispatch(loadChats({ roomId: roomId }))
  }

  const friendList = agentInfos.map(info => {
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"agent_" + info.agentId}
        onClick={() => {
          handleLoadChat(info.roomId, info.name, ChatType.ToUser)
          navigate("/customer/chat")
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "gray" }}>{info.name.charAt(0)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={info.name} secondary={info.agentUserId} />
      </ListItem>
    )
  })

  const channelList = channelInfos.map(info => {
    const chat = {
      unreadCount: 1,
    }
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"channel_" + info.id}
        onClick={() => {
          handleEnterChannel(info)
          navigate("/customer/chat")
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "gray" }}>{info.name.charAt(0)}</Avatar>
        </ListItemAvatar>

        <ListItemText primary={info.name} secondary={info.id} />

        {chat.unreadCount > 0 && (
          <Badge badgeContent={chat.unreadCount > 99 ? "99+" : chat.unreadCount} color="error" />
        )}
      </ListItem>
    )
  })

  return (
    <>
      <CSWebSocket />
      <Box sx={{ maxWidth: 400, bgcolor: "background.paper", p: 2, borderRadius: 2, boxShadow: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">消息</Typography>
          <IconButton>
            <PhoneIcon color="primary" />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          聊天
        </Typography>

        {/* Message List */}
        <List>
          {channelList}
          {friendList}
        </List>
      </Box>
    </>

  );
};

export default CustomerPage;


