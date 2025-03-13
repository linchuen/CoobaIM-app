import { Alert, AppBar, Avatar, Box, IconButton, InputBase, Snackbar, Toolbar, Typography } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId, selectCurrentRoomName, selectEmoji, sendMessage, setEmoji } from "../../chat/ChatPageSlice";
import ChatMessages from "../../chat/components/ChatMessages";


const CustomerChatBox: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const currentRoomId = useAppSelector(selectCurrentRoomId)
  const roomName = useAppSelector(selectCurrentRoomName)
  const emoji = useAppSelector(selectEmoji)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      setInput("");
      inputRef.current?.focus();
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: "#1f1f1f" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/customer")}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar src="/path-to-avatar.jpg" sx={{ ml: 1, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{roomName}</Typography>
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

      {/* Input Box */}
      <Box sx={{ display: "flex", alignItems: "center", p: 1, bgcolor: "#fff", borderTop: "1px solid #ddd" }}>
        <IconButton color="primary">
          <AddCircleOutlineIcon />
        </IconButton>
        <InputBase
          sx={{ flexGrow: 1, ml: 1, mr: 1, p: 1, bgcolor: "#f0f0f0", borderRadius: 2 }}
          placeholder="發送消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          inputRef={inputRef}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomerChatBox;

