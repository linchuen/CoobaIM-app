import type React from "react"
import { useEffect, useState } from "react"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Chat, EmojiPeople, ExitToApp, People, Person, Search } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  loadChats,
  resetUnreadCount,
  selectRoomInfoList,
  selectRoomSubscribeSet,
  selectRoomUnreadMap,
  setChatType,
  setCurrentRoomId,
  setCurrentRoomName,
  subscribeGroups,
} from "./ChatPageSlice"
import { selectTokenInfo } from "../globalSlice"
import ChatBox from "./ChatBox"
import AddFriendDiaLog from "./components/AddFriendDiaLog"
import AddRoomDiaLog from "./components/AddRoomDiaLog"
import WebSocket from "./components/WebSocket"
import { handleFetch, transferChat } from "../../services/common"
import { fetchPermitFriend } from "../../services/FriendApi"
import type { PermitFriendResponse } from "../../services/ResponseInterface"
import { WebSocketManager } from "../../services/websocketApi"
import { ChatType, TabType } from "../../services/constant"
import { addFriend, removeFriendApply, selectFriendApplyInfoList, selectFriendInfoList, setIsPersonal } from "./FriendSlice"
import { ChatInfo as ChatProto } from "../../../proto/ChatProto"
import { t } from "i18next"
import UserDetailDialog from "./components/UserDetailDialog"
import { useNavigate } from "react-router-dom"


const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const friendApplyInfos = useAppSelector(selectFriendApplyInfoList)
  const friendInfos = useAppSelector(selectFriendInfoList)
  const roomInfos = useAppSelector(selectRoomInfoList)
  const roomSubscribeSet = useAppSelector(selectRoomSubscribeSet)
  const roomUnreadMap = useAppSelector(selectRoomUnreadMap)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const [activeTab, setActiveTab] = useState(TabType.PERSONAL);

  useEffect(() => {
    if (friendInfos.length === 0 || !tokenInfo) return

    const stompClient = WebSocketManager.getInstance()
    friendInfos.forEach(friendInfo => {
      const roomId = friendInfo.roomId
      if (roomSubscribeSet.includes(roomId)) return

      stompClient.subscribeBinary(("/group/" + roomId), (body) => {
        const chatProto = ChatProto.deserializeBinary(body)
        dispatch(subscribeGroups({ userId: tokenInfo.userId, roomId: roomId, newChat: transferChat(chatProto) }))
      })
    })

  }, [dispatch, friendInfos, roomSubscribeSet, tokenInfo])

  useEffect(() => {
    if (roomInfos.length === 0 || !tokenInfo) return

    const stompClient = WebSocketManager.getInstance()
    roomInfos.forEach(roomInfo => {
      const roomId = roomInfo.id
      if (roomSubscribeSet.includes(roomId)) return

      stompClient.subscribeBinary(("/group/" + roomId), (body) => {
        const chatProto = ChatProto.deserializeBinary(body)
        dispatch(subscribeGroups({ userId: tokenInfo.userId, roomId: roomId, newChat: transferChat(chatProto) }))
      })
    })

  }, [dispatch, roomInfos, roomSubscribeSet, tokenInfo])


  const handleLoadChat = (roomId: number, name: string, type: ChatType) => {
    dispatch(setChatType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(setCurrentRoomName(name))
    dispatch(loadChats({ roomId: roomId }))
    dispatch(resetUnreadCount(roomId))

    console.log("websocket connection", WebSocketManager.getInstance().isConnected())
  }

  const handleFriendApply = async (
    applyUserId: number,
    isPermit: boolean,
    name: string,
  ) => {
    if (!tokenInfo) return

    await handleFetch<PermitFriendResponse>(
      dispatch,
      fetchPermitFriend({
        applyUserId: applyUserId,
        permitUserId: tokenInfo.userId,
        isPermit: isPermit,
      }, tokenInfo.token),
      data => {
        dispatch(removeFriendApply(applyUserId))
        if (isPermit) {
          dispatch(addFriend({
            userId: tokenInfo.userId,
            friendUserId: applyUserId,
            showName: name,
            roomId: data.roomId,
          }),
          )
        }
      },
    )
  }

  const friendApplyList = friendApplyInfos.map(info => {
    return (
      <ListItem sx={{ marginBottom: 1 }} key={"friend_" + info.id}>
        <Avatar sx={{ marginRight: 2 }}>{info.name.charAt(0)}</Avatar>
        <ListItemText primary={info.name} secondary={
          <>
            <Button
              sx={{ bgcolor: "green", color: "white", marginRight: 1 }}
              onClick={() => handleFriendApply(info.applyId, true, info.name)}
            >
              {t("accept")}
            </Button>
            <Button
              sx={{ bgcolor: "red", color: "white" }}
              onClick={() => handleFriendApply(info.applyId, false, info.name)}
            >
              {t("reject")}
            </Button>
          </>} />
      </ListItem>
    )
  })

  const friendList = friendInfos.map(info => {
    const roomUnread = roomUnreadMap[info.roomId]
    const message = roomUnread ? roomUnread.chat.message : ""
    const unreadCount = roomUnread ? roomUnread.unread : 0
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"friend_" + info.friendUserId}
        onClick={() => {
          dispatch(setIsPersonal(true))
          handleLoadChat(info.roomId, info.showName, ChatType.ToUser)
        }}
      >
        <Avatar sx={{ marginRight: 2 }}>{info.showName.charAt(0)}</Avatar>
        <ListItemText primary={info.showName} secondary={
          <Typography
            variant="body2"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
              display: "block",
            }}
          >
            {message}
          </Typography>} />
        {unreadCount > 0 && (
          <Badge badgeContent={unreadCount > 99 ? "99+" : unreadCount} color="error" />
        )}
      </ListItem>
    )
  })

  const roomList = roomInfos.map(info => {
    const roomUnread = roomUnreadMap[info.id]
    const message = roomUnread ? roomUnread.chat.message : ""
    const unreadCount = roomUnread ? roomUnread.unread : 0
    return (
      <ListItem
        key={"room_" + info.id}
        onClick={() => {
          dispatch(setIsPersonal(false))
          handleLoadChat(info.id, info.name, ChatType.ToRoom)
        }}
      >
        <Avatar sx={{ marginRight: 2, bgcolor: "#3f51b5" }}>
          <Chat />
        </Avatar>
        <ListItemText primary={info.name} secondary={
          <Typography
            variant="body2"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
              display: "block",
            }}
          >
            {message}
          </Typography>} />
        {unreadCount > 0 && (
          <Badge badgeContent={unreadCount > 99 ? "99+" : unreadCount} color="error" />
        )}
      </ListItem>
    )
  })

  return (
    <>
      <WebSocket />
      <Box display="flex" height="100vh" bgcolor="#0d1117" color="white">
        {/* Sidebar */}
        <Box width={80} bgcolor="#1C252C" p={2} display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <UserDetailDialog />
            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton onClick={() => setActiveTab(TabType.FRIEND_APPLY)}>
                <EmojiPeople sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white" }}>{t("friendApply")}</Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton onClick={() => setActiveTab(TabType.PERSONAL)}>
                <Person sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white" }}>{t("personChat")}</Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton onClick={() => setActiveTab(TabType.GROUP)}>
                <People sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white" }}>{t("groupChat")}</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => navigate("/")}><ExitToApp sx={{ color: "white" }} /></IconButton>
        </Box>

        {/* menu List */}
        <Paper
          sx={{
            width: 280,
            padding: 2,
            overflow: "auto",
            bgcolor: "#161b22",
            color: "white",
            boxShadow: 3,
            margin: 2,
            borderRadius: 2,
          }}
        >
          {/* Friend Request */}
          {activeTab === TabType.FRIEND_APPLY && (
            <>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="h6" sx={{ pl: 1 }}>{t("friendApply")}</Typography>
              </Box>
              <List>{friendApplyList}</List>
            </>
          )}

          {/* Personal Chats */}
          {activeTab === TabType.PERSONAL && (
            <>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="h6" sx={{ pl: 1 }}>{t("personChat")}</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <InputBase
                    placeholder={t("searchMessage")}
                    sx={{
                      bgcolor: "#0d1117",
                      borderRadius: 2,
                      paddingX: 2,
                      color: "white",
                    }}
                  />
                  <IconButton sx={{ color: "white" }} onClick={() => { }}>
                    <Search />
                  </IconButton>
                  <AddFriendDiaLog />
                </Box>
              </Box>
              <List>{friendList}</List>
            </>
          )}

          {/* Group Chats */}
          {activeTab === TabType.GROUP && (
            <>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="h6" sx={{ pl: 1 }}>{t("groupChat")}</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <InputBase
                    placeholder={t("searchMessage")}
                    sx={{
                      bgcolor: "#0d1117",
                      borderRadius: 2,
                      paddingX: 2,
                      color: "white",
                    }}
                  />
                  <IconButton sx={{ color: "white" }} onClick={() => { }}>
                    <Search />
                  </IconButton>
                  <AddRoomDiaLog />
                </Box>
              </Box>
              <List>{roomList}</List>
            </>
          )}
        </Paper>

        <ChatBox />
      </Box >
    </>
  )

}

export default ChatPage
