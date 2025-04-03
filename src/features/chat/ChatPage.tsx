import type React from "react"
import { useState } from "react"
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material"
import { EmojiPeople, ExitToApp, People, Person } from "@mui/icons-material"
import ChatBox from "./ChatBox"
import WebSocket from "./components/WebSocket"
import { TabType } from "../../services/constant"
import { t } from "i18next"
import UserDetailDialog from "./components/UserDetailDialog"
import { useNavigate } from "react-router-dom"
import FriendApplyPaper from "./components/FriendApplyPaper"
import FriendListPaper from "./components/FriendListPaper"
import RoomListPaper from "./components/RoomListPaper"


const ChatPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(TabType.PERSONAL);

  return (
    <>
      <WebSocket />
      <Box display="flex" height="100vh" bgcolor="#0d1117" color="white">
        {/* Sidebar */}
        <Box width={80} bgcolor="#1C252C" p={2} display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <UserDetailDialog />
            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton onClick={() => setActiveTab(TabType.FRIEND_APPLY)}>
                <EmojiPeople sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white" }}>{t("friendApply")}</Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton onClick={() => setActiveTab(TabType.PERSONAL)}>
                <Person sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white" }}>{t("personChat")}</Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton onClick={() => setActiveTab(TabType.GROUP)}>
                <People sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: "white" }}>{t("groupChat")}</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => navigate("/")}><ExitToApp sx={{ color: "white" }} /></IconButton>
        </Box>

        {/* Friend Request */}
        {activeTab === TabType.FRIEND_APPLY && (<FriendApplyPaper />)}

        {/* Personal Chats */}
        {activeTab === TabType.PERSONAL && (<FriendListPaper />)}

        {/* Group Chats */}
        {activeTab === TabType.GROUP && (<RoomListPaper />)}
        <ChatBox />
      </Box >
    </>
  )

}

export default ChatPage
