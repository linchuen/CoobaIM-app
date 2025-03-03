import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import type React from "react"
import { useRef, useState } from "react"
import { fetchBuildRoom } from "../../../services/RoomApi"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectTokenInfo } from "../../globalSlice"
import { handleFetch } from "../../../services/common"
import type {
  BuildRoomResponse,
} from "../../../services/ResponseInterface"
import { addRoom, selectFriendInfoList } from "../ChatPageSlice";

const AddRoomDiaLog: React.FC = () => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const friendInfoList = useAppSelector(selectFriendInfoList)
  const [openAddRoom, setOpenAddRoom] = useState(false)
  const [openCreateAlert, setOpenCreateAlert] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<number[]>([])

  const onClose = () => setOpenAddRoom(false)

  const handleCreateRoom = async () => {
    if (inputRef.current && tokenInfo) {
      const roomName = inputRef.current.value

      await handleFetch<BuildRoomResponse>(
        dispatch,
        fetchBuildRoom({
          name: roomName,
          userIds: selectedFriends
        }, tokenInfo.token),
        data => {
          dispatch(addRoom({
            id: data.roomId,
            name: roomName
          }))
          setOpenCreateAlert(true)
          setSelectedFriends([])
          onClose()
        },
      )
    }
  }

  const handleToggle = (friend: number) => {
    setSelectedFriends(prev =>
      prev.includes(friend)
        ? prev.filter(f => f !== friend)
        : [...prev, friend],
    )
  }
  return (
    <>
      <IconButton
        sx={{ color: "white" }}
        size="small"
        onClick={() => setOpenAddRoom(true)}
      >
        <AddIcon />
      </IconButton>
      <Dialog
        open={openAddRoom}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        {/* 標題區 (含關閉按鈕) */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          建立聊天室
          <IconButton
            onClick={() => {
              onClose()
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* 內容區 */}
        <DialogContent dividers>
          {/* 搜尋輸入框與按鈕 (並排) */}
          <Box display="flex" gap={1} sx={{ marginBottom: 2 }}>
            <TextField
              inputRef={inputRef}
              autoFocus
              label="Room Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <Button onClick={handleCreateRoom} variant="contained">
              建立
            </Button>
          </Box>
          {/* 好友列表 */}
          <Typography variant="h6">選擇好友：</Typography>
          <List sx={{ columns: { xs: 1, sm: 2, md: 3 }, gap: 1 }}>
            {friendInfoList.map(info => (
              <ListItem key={info.friendUserId} onClick={() => handleToggle(info.friendUserId)}>
                <Checkbox checked={selectedFriends.includes(info.friendUserId)} />
                <ListItemText primary={info.showName} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openCreateAlert}
        autoHideDuration={3000}
        onClose={() => setOpenCreateAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenCreateAlert(false)}
          severity={"success"}
          variant="filled"
        >
          {"聊天室建立成功！"}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AddRoomDiaLog
