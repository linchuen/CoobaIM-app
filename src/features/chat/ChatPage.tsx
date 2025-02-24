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
  loadChats,
  loadFriendApply,
  loadFriends,
  loadGroups,
  removeApply,
  selectFriendApplyInfoList,
  selectFriendInfoList,
  selectRoomInfoList,
  setCurrentRoomId,
  setType,
} from "./ChatPageSlice"
import { selectIsLogin, selectTokenInfo } from "../globalSlice"
import ChatBox from "./components/ChatBox"
import AddFriendDiaLog from "./components/AddFriendDiaLog"
import AddRoomDiaLog from "./components/AddRoomDiaLog"
import { handleFetch } from "../../services/common"
import { fetchPermitFriend } from "../../services/FriendApi"
import type { PermitFriendResponse } from "../../services/ResponseInterface"
import { WebSocketManager } from "../../services/websocketApi"
import config from "../../app/config"


const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const friendApplyInfos = useAppSelector(selectFriendApplyInfoList)
  const friendInfos = useAppSelector(selectFriendInfoList)
  const roomInfos = useAppSelector(selectRoomInfoList)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const isLogin = useAppSelector(selectIsLogin)
  const [openAddFriend, setOpenAddFriend] = useState(false)
  const [openAddRoom, setOpenAddRoom] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    if (isLogin || config.useFake) {
      dispatch(loadFriends({ friendUserIds: [] }))
      dispatch(loadGroups({ roomIds: [] }))
      dispatch(loadFriendApply(null))
    }
  }, [dispatch, isLogin])

  const handleLoadChat = (roomId: number, type: string) => {
    dispatch(setType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(loadChats({ roomId: roomId }))
    WebSocketManager.getInstance().subscribe("/topic/broadcast", (message) => console.log(message.body))
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
        dispatch(removeApply(applyUserId))
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
