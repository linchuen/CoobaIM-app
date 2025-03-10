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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { WebSocketManager } from "../../services/websocketApi";
import { selectTokenInfo } from "../globalSlice";
import { loadChats, selectChannelList, selectFriendInfoList, selectRoomSubscribeSet, setCurrentRoomId, setCurrentRoomName, setType, subscribeGroups } from "./CustomerPageSlice";
import CSWebSocket from "./components/CSWebSocket";
import { useNavigate } from "react-router-dom";

const CustomerPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const friendInfos = useAppSelector(selectFriendInfoList)
  const channelInfos = useAppSelector(selectChannelList)
  const roomSubscribeSet = useAppSelector(selectRoomSubscribeSet)
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    if (friendInfos.length === 0 || !tokenInfo) return

    const stompClient = WebSocketManager.getInstance()
    friendInfos.forEach(friendInfo => {
      const roomId = friendInfo.roomId
      if (roomSubscribeSet.includes(roomId)) return

      stompClient.subscribe(("/group/" + roomId), (message: IMessage) => {
        dispatch(subscribeGroups({ userId: tokenInfo.userId, roomId: roomId, message: message }))
      })
    })

  }, [dispatch, friendInfos, roomSubscribeSet, tokenInfo])

  const handleEnterChat = (roomId: number, name: string, type: string) => {
    dispatch(setType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(setCurrentRoomName(name))
    dispatch(loadChats({ roomId: roomId }))
  }

  const handleLoadChat = (roomId: number, name: string, type: string) => {
    dispatch(setType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(setCurrentRoomName(name))
    dispatch(loadChats({ roomId: roomId }))
  }

  const friendList = friendInfos.map(info => {
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"friend_" + info.friendUserId}
        onClick={() => {
          handleLoadChat(info.roomId, info.showName, "user")
          navigate("/customer/chat")
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "gray" }}>{info.showName.charAt(0)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={info.showName} secondary={info.friendUserId} />
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
        key={"friend_" + info.id}
        onClick={() => {
          handleLoadChat(info.roomId, info.showName, "user")
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
