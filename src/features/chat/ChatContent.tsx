import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useRef } from "react"
import {
  Box,
  Alert,
  Snackbar,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  loadChatsByScroll,
  selectChatInfoList,
  selectCurrentRoomId,
  selectPastChatInfoList,
  selectUsePast,
} from "./ChatPageSlice"
import ChatMessages from "./components/ChatMessages"

const ChatContent: React.FC = () => {
  const dispatch = useAppDispatch()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const currentRoomId = useAppSelector(selectCurrentRoomId)
  const chatInfos = useAppSelector(selectChatInfoList)
  const pastChatInfos = useAppSelector(selectPastChatInfoList)
  const usePast = useAppSelector(selectUsePast)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
  }, [currentRoomId])

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return

    if (chatContainerRef.current.scrollTop === 0) {
      const chatId = usePast ? pastChatInfos[0].id : chatInfos[0].id
      dispatch(loadChatsByScroll({
        roomId: currentRoomId,
        chatId: chatId,
        searchAfter: false
      }))
    }
  }, [chatInfos, currentRoomId, dispatch, pastChatInfos, usePast])

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
  )
}

export default ChatContent
