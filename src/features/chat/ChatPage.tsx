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
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Chat } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addFriend,
  addFriendApply,
  loadChats,
  loadFriendApply,
  loadFriends,
  loadGroups,
  removeFriendApply,
  selectFriendApplyInfoList,
  selectFriendInfoList,
  selectRoomInfoList,
  selectRoomSubscribeSet,
  setCurrentRoomId,
  setType,
  subscribeGroups,
} from "./ChatPageSlice"
import { selectTokenInfo } from "../globalSlice"
import ChatBox from "./components/ChatBox"
import AddFriendDiaLog from "./components/AddFriendDiaLog"
import AddRoomDiaLog from "./components/AddRoomDiaLog"
import { handleFetch } from "../../services/common"
import { fetchPermitFriend } from "../../services/FriendApi"
import type { FriendApplyInfo, FriendInfo, PermitFriendResponse, RoomInfo } from "../../services/ResponseInterface"
import { WebSocketManager } from "../../services/websocketApi"
import type { IMessage } from "@stomp/stompjs"


const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const friendApplyInfos = useAppSelector(selectFriendApplyInfoList)
  const friendInfos = useAppSelector(selectFriendInfoList)
  const roomInfos = useAppSelector(selectRoomInfoList)
  const roomSubscribeSet = useAppSelector(selectRoomSubscribeSet)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const [openAddFriend, setOpenAddFriend] = useState(false)
  const [openAddRoom, setOpenAddRoom] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    const addFriendApplyEvent = (message: IMessage) => {
      const newFriendApply = JSON.parse(message.body) as FriendApplyInfo
      dispatch(addFriendApply(newFriendApply))
    }
    const addFriendEvent = (message: IMessage) => {
      const newFriend = JSON.parse(message.body) as FriendInfo
      dispatch(addFriend(newFriend))
    }
    const loadData = (webSocket: WebSocketManager) => {
      dispatch(loadFriends({ friendUserIds: [] }))
      dispatch(loadGroups({ roomIds: [] }))
      dispatch(loadFriendApply(null))

      webSocket.subscribe("/user/queue/friend_apply", addFriendApplyEvent)
      webSocket.subscribe("/user/queue/friend_add", addFriendEvent)
    }

    if (tokenInfo) {
      const webSocket = WebSocketManager.getInstance()
      webSocket.connect(tokenInfo.userId, tokenInfo.token, () => loadData(webSocket))
    }
  }, [dispatch, tokenInfo])

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


  const handleLoadChat = (roomId: number, type: string) => {
    dispatch(setType(type))
    dispatch(setCurrentRoomId(roomId))
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
        onClick={() => handleLoadChat(info.roomId, "user")}
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
        onClick={() => handleLoadChat(info.id, "room")}
      >
        <Avatar sx={{ marginRight: 2, bgcolor: "#3f51b5" }}>
          <Chat />
        </Avatar>
        <ListItemText primary={info.name} secondary={info.id} />
      </ListItem>
    )
  })

  return (
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
            <IconButton
              sx={{ color: "white" }}
              size="small"
              onClick={() => setOpenAddFriend(true)}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              onClick={() => setOpenDialog(true)}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        </Box>
        <List>{friendList.slice(0, 6)}</List>
        <Divider sx={{ my: 2, bgcolor: "#282c34" }} />

        {/* Group Chats Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Group Chats</Typography>
          <Box>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              onClick={() => setOpenAddRoom(true)}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              onClick={() => setOpenDialog(true)}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        </Box>
        <List>{roomList.slice(0, 6)}</List>
      </Paper>

      <AddFriendDiaLog
        open={openAddFriend}
        onClose={() => setOpenAddFriend(false)}
      />

      <AddRoomDiaLog open={openAddRoom} onClose={() => setOpenAddRoom(false)} />

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
          <Tab label="我的好友" />
          <Tab label="我的聊天室" />
        </Tabs>
        <Box p={2}>
          {tabIndex === 0 ? <List>{friendList}</List> : <List>{roomList}</List>}
        </Box>
      </Dialog>

      <ChatBox />
    </Box>
  )
}

export default ChatPage

