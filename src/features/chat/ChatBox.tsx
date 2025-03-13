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
  DateRange,
  ArrowBack,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  selectCurrentRoomId,
  selectCurrentRoomName,
  selectEmoji,
  sendMessage,
  setEmoji,
} from "./ChatPageSlice"
import { v4 as uuidv4 } from 'uuid';
import { selectTokenInfo } from "../globalSlice"
import { useNavigate } from "react-router-dom"
import UploadDialog from "./components/AddFileDialog"
import EmojiChatDialog from "./components/AddEmojiDialog"
import UploadImageDialog from "./components/AddPictureDialog"
import ChatMessages from "./components/ChatMessages"
import LiveRoomDialoag from "./components/AddLiveRoomDialog"
import AddMemberDialog from "./components/AddMemberDialog"
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RemoveMemberDialog from "./components/RemoveMemberDialog"

const ChatBox: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const currentRoomId = useAppSelector(selectCurrentRoomId)
  const roomName = useAppSelector(selectCurrentRoomName)
  const emoji = useAppSelector(selectEmoji)
  const [open, setOpen] = useState(false)

  const handleSendMessage = () => {
    if (currentRoomId === 0) return

    if (inputRef.current && tokenInfo) {
      dispatch(
        sendMessage({
          uuid: uuidv4(),
          roomId: currentRoomId,
          message: inputRef.current.value,
          userId: tokenInfo.userId
        }),
      )
      inputRef.current.value = ""
    }
  }

  useEffect(() => {
    if (inputRef.current && tokenInfo && emoji !== "") {
      inputRef.current.value += emoji
      dispatch(setEmoji(""))
    }
  }, [dispatch, emoji, tokenInfo])

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
  }, [currentRoomId])

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return

    if (chatContainerRef.current.scrollTop === 0) {
      setOpen(true)
    }
  }, [])

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
          <AddMemberDialog />
          <RemoveMemberDialog />
          <IconButton sx={{ color: "white" }}>
            <SwapHorizIcon />
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
        <ChatMessages />

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
      {currentRoomId !== 0 ?
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
          <EmojiChatDialog />
          <UploadImageDialog />
          <UploadDialog />
          <LiveRoomDialoag />
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
    </Box>
  )
}

export default ChatBox
