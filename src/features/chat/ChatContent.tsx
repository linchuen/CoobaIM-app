import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
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
  selectShowAlert,
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
  const showAlert = useAppSelector(selectShowAlert)
  const [open, setOpen] = useState(false)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [currentRoomId, chatInfos.length])


  const handleScroll = useCallback(() => {
    if (isLoadingRef.current) return
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return
  
    if (chatContainer.scrollTop === 0) {
      const currentChatInfos = usePast ? pastChatInfos : chatInfos
      const chatId = currentChatInfos?.[0]?.id
      if (!chatId) return
  
      const prevScrollHeight = chatContainer.scrollHeight
      isLoadingRef.current = true
  
      dispatch(loadChatsByScroll({
        roomId: currentRoomId,
        chatId,
        searchAfter: false
      })).then(() => {
        isLoadingRef.current = false
        setOpen(showAlert)
        const newScrollHeight = chatContainer.scrollHeight
        chatContainer.scrollTop = newScrollHeight - prevScrollHeight
      })
  
      return
    }
  
    const isAtBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 10
    if (isAtBottom && usePast) {
      const lastChatId = pastChatInfos[pastChatInfos.length - 1]?.id
      if (!lastChatId) return
      isLoadingRef.current = true
      dispatch(loadChatsByScroll({
        roomId: currentRoomId,
        chatId: lastChatId,
        searchAfter: true
      })).finally(() => {
        isLoadingRef.current = false
      })
    }
  }, [chatInfos, currentRoomId, dispatch, pastChatInfos, showAlert, usePast])
  

  // 綁定 scroll 事件
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
