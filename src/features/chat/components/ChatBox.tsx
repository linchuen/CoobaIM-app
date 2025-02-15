import type React from "react"
import { useRef } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Paper,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material"
import {
  Search,
  GroupAdd,
  AttachFile,
  InsertEmoticon,
  Image,
  VideoCall,
  Call,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectChatInfoList,
  selectCurrentRoomId,
  sendMessage,
} from "../ChatPageSlice"
import { selectTokenInfo } from "../../common/globalSlice"

const ChatBox: React.FC = () => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const chatInfos = useAppSelector(selectChatInfoList)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const currentRoomId = useAppSelector(selectCurrentRoomId)

  const handleSendMessage = () => {
    console.log("sendMessage")
    if (inputRef.current) {
      dispatch(
        sendMessage({
          roomId: currentRoomId,
          message: inputRef.current.value,
        }),
      )
    }
  }

  const userId = tokenInfo?.userId

  let messages = chatInfos.map(chat => {
    const isSelf = chat.userId !== userId
    return (
      <Box
        key={chat.id}
        display="flex"
        flexDirection="column"
        alignItems={isSelf ? "flex-start" : "flex-end"}
        sx={{ gap: 0.5 }}
      >
        <Typography variant="caption" color="#b9bbbe">
          {chat.name}
        </Typography>
        <Paper
          sx={{
            padding: 1.5,
            borderRadius: 2,
            maxWidth: "60%",
            bgcolor: isSelf ? "#282c34" : "#3f51b5",
            color: isSelf ? "#b9bbbe" : "white",
            boxShadow: 2,
          }}
        >
          {chat.message}
        </Paper>
      </Box>
    )
  })

  return (
    <Box flex={1} display="flex" flexDirection="column" padding={2}>
      {/* Search Bar */}
      <AppBar
        position="static"
        color="default"
        sx={{ mb: 1, bgcolor: "#161b22", borderRadius: 2 }}
      >
        <Toolbar>
          <InputBase
            placeholder="Search messages..."
            fullWidth
            sx={{
              bgcolor: "#0d1117",
              borderRadius: 2,
              paddingX: 2,
              color: "white",
            }}
          />
          <IconButton sx={{ color: "white" }}>
            <Search />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <GroupAdd />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box
        flex={1}
        padding={2}
        overflow="auto"
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {messages}
      </Box>

      {/* Input Area */}
      <Paper
        sx={{
          padding: 1.5,
          display: "flex",
          alignItems: "center",
          bgcolor: "#161b22",
          boxShadow: 3,
          borderRadius: 2,
          gap: 1,
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <Image />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <InsertEmoticon />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <AttachFile />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <VideoCall />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Call />
        </IconButton>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          sx={{
            bgcolor: "#0d1117",
            borderRadius: 2,
            input: { color: "white" },
          }}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: "#3f51b5", color: "white" }}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Paper>
    </Box>
  )
}

export default ChatBox
