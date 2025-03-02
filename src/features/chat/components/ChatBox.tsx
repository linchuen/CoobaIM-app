import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useRef } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material"
import {
  Search,
  AttachFile,
  InsertEmoticon,
  Image,
  VideoCall,
  Call,
  DateRange,
  ArrowBack,
} from "@mui/icons-material"
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectChatInfoList,
  selectCurrentRoomId,
  selectCurrentRoomName,
  selectEmoji,
  sendMessage,
  setEmoji,
} from "../ChatPageSlice"
import { selectTokenInfo } from "../../globalSlice"
import { useNavigate } from "react-router-dom"
import UploadDialog from "./UploadFileDialog"
import EmojiChatDialog from "./EmojiChatDialog"

const ChatBox: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatInfos = useAppSelector(selectChatInfoList)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const currentRoomId = useAppSelector(selectCurrentRoomId)
  const roomName = useAppSelector(selectCurrentRoomName)
  const emoji = useAppSelector(selectEmoji)
  const [open, setOpen] = useState(false)
  const [fileOpen, setFileOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)

  const handleSendMessage = () => {
    if (currentRoomId === 0) return

    if (inputRef.current && tokenInfo) {
      dispatch(
        sendMessage({
          roomId: currentRoomId,
          message: inputRef.current.value,
          userId: tokenInfo.userId
        }),
      )
      inputRef.current.value = ""
    }

  }

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return

    if (chatContainerRef.current.scrollTop === 0) {
      setOpen(true)
    }
  }, [dispatch, currentRoomId])

  useEffect(() => {
    if (inputRef.current && tokenInfo && emoji !== "") {
      inputRef.current.value += emoji
      dispatch(setEmoji(""))
    }
  }, [dispatch, emoji, tokenInfo])

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [handleScroll])

  const userId = tokenInfo?.userId

  let messages = chatInfos.map(chat => {
    const isSelf = chat.userId === userId
    return (
      <Box
        key={chat.id}
        display="flex"
        flexDirection="column"
        alignItems={isSelf ? "flex-end" : "flex-start"}
        sx={{ gap: 0.5 }}
      >
        <Box display="flex" alignItems="center" sx={{ gap: 0.5 }}>
          {chat.success === false && isSelf && (
            <ErrorOutlineIcon sx={{ color: "red", fontSize: 18 }} />
          )}
          <Paper
            sx={{
              padding: 1.5,
              borderRadius: 2,
              maxWidth: "300px",
              bgcolor: isSelf ? "#282c34" : "#3f51b5",
              color: isSelf ? "#b9bbbe" : "white",
              wordBreak: "break-word", // 確保長字串能夠換行
              overflowWrap: "break-word",
              boxShadow: 2,
            }}
          >
            {chat.message}
          </Paper>
        </Box>
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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton sx={{ color: "white" }} onClick={() => navigate("/")}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" color="white">
              {roomName}
            </Typography>
          </Box>
        </Toolbar>
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
            <DateRange />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <PersonAddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box
        ref={chatContainerRef}
        flex={1}
        padding={2}
        overflow="auto"
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        {messages}
        {/* Snackbar 提示 */}
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setOpen(false)} severity="info">
            已經是最上方
          </Alert>
        </Snackbar>
      </Box>

      {/* Input Area */}
      {tokenInfo ?
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
          <IconButton sx={{ color: "white" }} >
            <Image />
          </IconButton>
          <IconButton sx={{ color: "white" }} onClick={() => setEmojiOpen(true)}>
            <InsertEmoticon />
          </IconButton>
          <IconButton sx={{ color: "white" }} onClick={() => setFileOpen(true)}>
            <AttachFile />
          </IconButton>
          <IconButton sx={{ color: "white" }} >
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSendMessage()
              }
            }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: "#3f51b5", color: "white" }}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Paper> : <></>}

      <UploadDialog open={fileOpen} onClose={() => setFileOpen(false)} />
      <EmojiChatDialog open={emojiOpen} onClose={() => setEmojiOpen(false)} />
    </Box>
  )
}

export default ChatBox
