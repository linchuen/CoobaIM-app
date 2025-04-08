import type React from "react"
import { useEffect } from "react"
import { useRef } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material"
import {
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
import LiveRoomDialoag from "./components/AddLiveRoomDialog"
import AddMemberDialog from "./components/AddMemberDialog"
import RemoveMemberDialog from "./components/RemoveMemberDialog"
import MuiDatePicker from "./components/MuiDatePicker"
import ChatSearchBox from "./components/ChatSearchBox"
import { selectIsPersonal } from "./FriendSlice"
import TransferPermissionDialog from "./components/TransferPermissionDialog"
import { t } from "i18next"
import ChatContent from "./ChatContent"

const ChatBox: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const currentRoomId = useAppSelector(selectCurrentRoomId)
  const roomName = useAppSelector(selectCurrentRoomName)
  const isPersonal = useAppSelector(selectIsPersonal)
  const emoji = useAppSelector(selectEmoji)

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

      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
      }
    }
  }

  useEffect(() => {
    if (inputRef.current && tokenInfo && emoji !== "") {
      inputRef.current.value += emoji
      dispatch(setEmoji(""))
    }
  }, [dispatch, emoji, tokenInfo])

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
          <ChatSearchBox />
          <MuiDatePicker />
          {isPersonal ? <></>
            : <>
              <AddMemberDialog />
              <RemoveMemberDialog />
              <TransferPermissionDialog />
            </>}
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <ChatContent />

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
            placeholder={t("typeMessage")}
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
            {t("send")}
          </Button>
        </Paper> : <></>}
    </Box>
  )
}

export default ChatBox
