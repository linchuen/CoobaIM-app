import { Chat, Search } from "@mui/icons-material"
import { ListItem, Avatar, ListItemText, Typography, Badge, Box, IconButton, Paper, InputBase, List } from "@mui/material"
import { t } from "i18next"
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { transferChat } from "../../../services/common"
import { TabType, ChatType } from "../../../services/constant"
import { WebSocketManager } from "../../../services/websocketApi"
import { selectTokenInfo } from "../../globalSlice"
import { selectRoomInfoList, selectRoomSubscribeSet, selectRoomUnreadMap, subscribeGroups, setChatType, setCurrentRoomId, setCurrentRoomName, loadChats, resetUnreadCount } from "../ChatPageSlice"
import { setIsPersonal } from "../FriendSlice"
import AddRoomDiaLog from "./AddRoomDiaLog"
import { ChatInfo as ChatProto } from "../../../proto/ChatProto"


const RoomListPaper: React.FC = () => {
  const dispatch = useAppDispatch()
  const roomInfos = useAppSelector(selectRoomInfoList)
  const roomSubscribeSet = useAppSelector(selectRoomSubscribeSet)
  const roomUnreadMap = useAppSelector(selectRoomUnreadMap)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const [searchRoomKeyword, setSearchRoomKeyword] = useState("");

  const filteredRoomInfos = useMemo(() => {
    return roomInfos.filter(info =>
      info.name.toLowerCase().includes(searchRoomKeyword.toLowerCase())
    );
  }, [searchRoomKeyword, roomInfos]);

  useEffect(() => {
    if (roomInfos.length === 0 || !tokenInfo) return

    const stompClient = WebSocketManager.getInstance()
    roomInfos.forEach(roomInfo => {
      const roomId = roomInfo.id
      if (roomSubscribeSet.includes(roomId)) return

      stompClient.subscribeBinary(("/group/" + roomId), (body) => {
        const chatProto = ChatProto.deserializeBinary(body)
        dispatch(subscribeGroups({ userId: tokenInfo.userId, roomId: roomId, newChat: transferChat(chatProto) }))
      })
    })

  }, [dispatch, roomInfos, roomSubscribeSet, tokenInfo])


  const handleLoadChat = (roomId: number, name: string, type: ChatType) => {
    dispatch(setChatType(type))
    dispatch(setCurrentRoomId(roomId))
    dispatch(setCurrentRoomName(name))
    dispatch(loadChats({ roomId: roomId }))
    dispatch(resetUnreadCount(roomId))

    console.log("websocket connection", WebSocketManager.getInstance().isConnected())
  }

  return (
    <Paper
      sx={{
        width: 280,
        padding: 2,
        overflow: "auto",
        bgcolor: "#161b22",
        color: "white",
        boxShadow: 3,
        margin: 2,
        borderRadius: 2,
      }}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h6" sx={{ pl: 1 }}>{t("groupChat")}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <InputBase
            onChange={(e) => setSearchRoomKeyword(e.target.value)}
            placeholder={t("searchMessage")}
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
          <AddRoomDiaLog />
        </Box>
      </Box>
      <List>{filteredRoomInfos
        .map(info => {
          const roomUnread = roomUnreadMap[info.id]
          const message = roomUnread ? roomUnread.chat.message : ""
          const unreadCount = roomUnread ? roomUnread.unread : 0
          return (
            <ListItem
              key={"room_" + info.id}
              onClick={() => {
                dispatch(setIsPersonal(false))
                handleLoadChat(info.id, info.name, ChatType.ToRoom)
              } }
            >
              <Avatar src={info.avatar} sx={{ marginRight: 2, bgcolor: "#3f51b5" }}>
                <Chat />
              </Avatar>
              <ListItemText primary={info.name} secondary={<Typography
                variant="body2"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                  display: "block",
                }}
              >
                {message}
              </Typography>} />
              {unreadCount > 0 && (
                <Badge badgeContent={unreadCount > 99 ? "99+" : unreadCount} color="error" />
              )}
            </ListItem>
          )
        })}</List>
    </Paper>
  )

}

export default RoomListPaper
