import type React from "react"
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
} from "@mui/material"
import { Chat } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  loadChats,
  loadFriends,
  loadGroups,
  selectFriendInfoList,
  selectRoomInfoList,
} from "./ChatPageSlice"
import { selectTokenInfo } from "../common/globalSlice"
import ChatBox from "./components/ChatBox"

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const friendInfos = useAppSelector(selectFriendInfoList)
  const roomInfos = useAppSelector(selectRoomInfoList)
  const tokenInfo = useAppSelector(selectTokenInfo)

  useEffect(() => {
    dispatch(loadFriends({ friendUserIds: [] }))
    dispatch(loadGroups({ roomIds: [] }))
  }, [dispatch, tokenInfo])

  const handleLoadChat = (roomId: number) =>
    dispatch(loadChats({ roomId: roomId }))

  const friendList = friendInfos.map(info => {
    return (
      <ListItem
        sx={{ marginBottom: 1 }}
        key={"friend_" + info.id}
        onClick={() => handleLoadChat(1)}
      >
        <Avatar sx={{ marginRight: 2 }}>{info.showName.charAt(0)}</Avatar>
        <ListItemText primary={info.showName} secondary={info.friendUserId} />
      </ListItem>
    )
  })

  const roomList = roomInfos.map(info => {
    return (
      <ListItem key={"room_" + info.id} onClick={() => handleLoadChat(1)}>
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
        <Typography variant="h6" gutterBottom>
          Personal Chats
        </Typography>
        <List>{friendList}</List>
        <Divider sx={{ my: 2, bgcolor: "#282c34" }} />
        <Typography variant="h6" gutterBottom>
          Group Chats
        </Typography>
        <List>{roomList}</List>
      </Paper>

      <ChatBox />
    </Box>
  )
}

export default ChatPage
