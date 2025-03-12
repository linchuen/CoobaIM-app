import type React from "react"
import { useEffect, useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Chat } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  loadChats,
  selectRoomInfoList,
  selectRoomSubscribeSet,
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
import { handleFetch } from "../../services/common"
import { fetchPermitFriend } from "../../services/FriendApi"
import type { PermitFriendResponse } from "../../services/ResponseInterface"
import { WebSocketManager } from "../../services/websocketApi"
import type { IMessage } from "@stomp/stompjs"
import { ChatType } from "../../services/constant"
import { addFriend, removeFriendApply, selectFriendApplyInfoList, selectFriendInfoList } from "./FriendSlice"


const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const friendApplyInfos = useAppSelector(selectFriendApplyInfoList)
  const friendInfos = useAppSelector(selectFriendInfoList)
  const roomInfos = useAppSelector(selectRoomInfoList)
  const roomSubscribeSet = useAppSelector(selectRoomSubscribeSet)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const [openDialog, setOpenDialog] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

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

  useEffect(() => {
    if (roomInfos.length === 0 || !tokenInfo) return

    const stompClient = WebSocketManager.getInstance()
    roomInfos.forEach(roomInfo => {
      const roomId = roomInfo.id
      if (roomSubscribeSet.includes(roomId)) return

      stompClient.subscribe(("/group/" + roomId), (message: IMessage) => {
        dispatch(subscribeGroups({ userId: tokenInfo.userId, roomId: roomId, message: message }))
      })
    })

  }, [dispatch, roomInfos, roomSubscribeSet, tokenInfo])


  const handleLoadChat = (roomId: number, name: string, type: ChatType) => {
    dispatch(setChatType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(setCurrentRoomName(name))
    dispatch(loadChats({ roomId: roomId }))
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
          dispatch(
            addFriend({
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
        <ListItemText primary={info.name} secondary={info.applyId} />
        <Button
          sx={{ bgcolor: "green", color: "white", marginRight: 1 }}
          onClick={() => handleFriendApply(info.applyId, true, info.name)}
        >
          Accept
        </Button>
        <Button
          sx={{ bgcolor: "red", color: "white" }}
          onClick={() => handleFriendApply(info.applyId, false, info.name)}
        >
          Reject
        </Button>
      </ListItem>
    )
  })

  const friendList = friendInfos.map(info => {
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"friend_" + info.friendUserId}
        onClick={() => {
          handleLoadChat(info.roomId, info.showName, ChatType.ToUser)
          setOpenDialog(false)
        }}
      >
        <Avatar sx={{ marginRight: 2 }}>{info.showName.charAt(0)}</Avatar>
        <ListItemText primary={info.showName} secondary={info.friendUserId} />
      </ListItem>
    )
  })

  const roomList = roomInfos.map(info => {
    return (
      <ListItem
        key={"room_" + info.id}
        onClick={() => {
          handleLoadChat(info.id, info.name, ChatType.ToRoom)
          setOpenDialog(false)
        }}
      >
        <Avatar sx={{ marginRight: 2, bgcolor: "#3f51b5" }}>
          <Chat />
        </Avatar>
        <ListItemText primary={info.name} secondary={info.id} />
      </ListItem>
    )
  })

  return (
    <>
      <WebSocket />
      <Box display="flex" height="100vh" bgcolor="#0d1117" color="white">
        {/* Chat List */}
        <Paper
          sx={{
            width: 300,
            padding: 2,
            overflow: "auto",
            bgcolor: "#161b22",
            color: "white",
            boxShadow: 3,
            margin: 2,
            borderRadius: 2,
          }}
        >
          {/* Person Info Box */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar src="/path-to-avatar.jpg" sx={{ width: 50, height: 50, mr: 2 }} />
            <Box>
              <Typography variant="h6">{tokenInfo?.name}</Typography>
              <Typography variant="body2" color="gray">{tokenInfo?.userId}</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2, bgcolor: "#282c34" }} />

          {/* Friend Request Box */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Friend Apply</Typography>
          </Box>
          <List>{friendApplyList}</List>

          <Divider sx={{ my: 2, bgcolor: "#282c34" }} />

          {/* Personal Chats Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Personal Chats</Typography>
            <Box>
              <AddFriendDiaLog />
              <IconButton
                sx={{ color: "white" }}
                size="small"
                onClick={() => setOpenDialog(true)}
              >
                <VisibilityIcon />
              </IconButton>
            </Box>
          </Box>
          <List>{friendList.slice(0, 4)}</List>
          <Divider sx={{ my: 2, bgcolor: "#282c34" }} />

          {/* Group Chats Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Group Chats</Typography>
            <Box>
              <AddRoomDiaLog />
              <IconButton
                sx={{ color: "white" }}
                size="small"
                onClick={() => setOpenDialog(true)}
              >
                <VisibilityIcon />
              </IconButton>
            </Box>
          </Box>
          <List>{roomList.slice(0, 4)}</List>
        </Paper>

        {/* Dialog for viewing all contacts and chats */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <Tabs
            value={tabIndex}
            onChange={(event: any, newValue: number) => setTabIndex(newValue)}
            variant="fullWidth"
          >
            <Tab label="My Friend" />
            <Tab label="My Chat" />
          </Tabs>
          <Box p={2}>
            {tabIndex === 0 ? <List>{friendList}</List> : <List>{roomList}</List>}
          </Box>
        </Dialog>

        <ChatBox />
      </Box>
    </>
  )
}

export default ChatPage

