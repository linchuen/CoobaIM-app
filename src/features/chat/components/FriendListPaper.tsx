import { Search } from "@mui/icons-material"
import { ListItem, Avatar, ListItemText, Typography, Badge, Box, IconButton, Paper, InputBase, List } from "@mui/material"
import { t } from "i18next"
import { useState, useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { transferChat } from "../../../services/common"
import { ChatInfo as ChatProto } from "../../../proto/ChatProto"
import { WebSocketManager } from "../../../services/websocketApi"
import { selectTokenInfo } from "../../globalSlice"
import { selectRoomSubscribeSet, selectRoomUnreadMap, subscribeGroups, setChatType, setCurrentRoomId, setCurrentRoomName, loadChats, resetUnreadCount } from "../ChatPageSlice"
import { selectFriendInfoList, setIsPersonal } from "../FriendSlice"
import AddFriendDiaLog from "./AddFriendDiaLog"
import { ChatType } from "../../../services/constant"

const FriendListPaper: React.FC = () => {
  const dispatch = useAppDispatch()
  const friendInfos = useAppSelector(selectFriendInfoList)
  const roomSubscribeSet = useAppSelector(selectRoomSubscribeSet)
  const roomUnreadMap = useAppSelector(selectRoomUnreadMap)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const [searchFriendKeyword, setSearchFriendKeyword] = useState("");

  const filteredFriendInfos = useMemo(() => {
    return friendInfos.filter(info =>
      info.showName.toLowerCase().includes(searchFriendKeyword.toLowerCase())
    );
  }, [searchFriendKeyword, friendInfos]);

  useEffect(() => {
    if (friendInfos.length === 0 || !tokenInfo) return

    const stompClient = WebSocketManager.getInstance()
    friendInfos.forEach(friendInfo => {
      const roomId = friendInfo.roomId
      if (roomSubscribeSet.includes(roomId)) return

      stompClient.subscribeBinary(("/group/" + roomId), (body) => {
        const chatProto = ChatProto.deserializeBinary(body)
        dispatch(subscribeGroups({ userId: tokenInfo.userId, roomId: roomId, newChat: transferChat(chatProto) }))
      })
    })

  }, [dispatch, friendInfos, roomSubscribeSet, tokenInfo])

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
        <Typography variant="h6" sx={{ pl: 1 }}>{t("personChat")}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <InputBase
            onChange={(e) => setSearchFriendKeyword(e.target.value)}
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
          <AddFriendDiaLog />
        </Box>
      </Box>
      <List>{
        filteredFriendInfos
          .map(info => {
            const roomUnread = roomUnreadMap[info.roomId]
            const message = roomUnread ? roomUnread.chat.message : ""
            const unreadCount = roomUnread ? roomUnread.unread : 0
            return (
              <ListItem
                sx={{ marginBottom: 1 }}
                key={"friend_" + info.friendUserId}
                onClick={() => {
                  dispatch(setIsPersonal(true))
                  handleLoadChat(info.roomId, info.showName, ChatType.ToUser)
                }}
              >
                <Avatar src={info.avatar} sx={{ marginRight: 2 }}>{info.showName.charAt(0)}</Avatar>
                <ListItemText primary={info.showName} secondary={<Typography
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
          })
      }</List>
    </Paper>
  )

}

export default FriendListPaper
