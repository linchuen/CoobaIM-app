import type React from "react"
import { useState } from "react"
import { useEffect } from "react"
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Divider,
  Typography,
  IconButton,
  Dialog,
  Tabs,
  Tab, Button,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Chat } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  loadChats,
  loadFriends,
  loadGroups,
  selectFriendInfoList,
  selectRoomInfoList,
  setCurrentRoomId,
  setType,
} from "./ChatPageSlice"
import { selectTokenInfo } from "../common/globalSlice"
import ChatBox from "./components/ChatBox"

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const friendInfos = useAppSelector(selectFriendInfoList)
  const roomInfos = useAppSelector(selectRoomInfoList)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const [openDialog, setOpenDialog] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  const handleOpenDialog = () => setOpenDialog(true)
  const handleCloseDialog = () => setOpenDialog(false)
  const handleChangeTab = (event: any, newValue: number) =>
    setTabIndex(newValue)

  useEffect(() => {
    dispatch(loadFriends({ friendUserIds: [] }))
    dispatch(loadGroups({ roomIds: [] }))
  }, [dispatch, tokenInfo])

  const handleLoadChat = (roomId: number, type: string) => {
    dispatch(setType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(loadChats({ roomId: roomId }))
  }

  const friendApplyList = friendInfos.map(info => {
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"friend_" + info.id}
      >
        <Avatar sx={{ marginRight: 2 }}>{info.showName.charAt(0)}</Avatar>
        <ListItemText primary={info.showName} secondary={info.friendUserId} />
        <Button sx={{ bgcolor: "green", color: "white", marginRight: 1 }}>
          Accept
        </Button>
        <Button sx={{ bgcolor: "red", color: "white" }}>Reject</Button>
      </ListItem>
    )
  })

  const friendList = friendInfos.map(info => {
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"friend_" + info.id}
        onClick={() => handleLoadChat(1, "user")}
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
        onClick={() => handleLoadChat(1, "room")}
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
            <IconButton sx={{ color: "white" }} size="small">
              <AddIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              onClick={handleOpenDialog}
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
            <IconButton sx={{ color: "white" }} size="small">
              <AddIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              onClick={handleOpenDialog}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        </Box>
        <List>{roomList.slice(0, 6)}</List>
      </Paper>

      {/* Dialog for viewing all contacts and chats */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <Tabs value={tabIndex} onChange={handleChangeTab} variant="fullWidth">
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
