import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import type React from "react"
import { useRef, useState } from "react"
import { handleFetch } from "../../../services/common"
import type { ApplyFriendResponse } from "../../../services/ResponseInterface"
import { selectTokenInfo } from "../../common/globalSlice"
import { fetchApplyFriend } from "../../../services/FriendApi"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"

interface AddFriendDiaLogProps {
  open: boolean
  onClose: () => void
}

const AddFriendDiaLog: React.FC<AddFriendDiaLogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const tokenInfo = useAppSelector(selectTokenInfo)
  const [openApplyAlert, setOpenApplyAlert] = useState(false)
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("")

  function isPositiveInteger(str: string) {
    return /^[1-9]\d*$/.test(str)
  }

  const handleSubmit = async () => {
    if (inputRef.current && tokenInfo) {
      const userId = inputRef.current.value
      if (!isPositiveInteger(userId)) {
        setError(true)
        setHelperText("僅允許輸入數字")
        return
      }

      await handleFetch<ApplyFriendResponse>(
        dispatch,
        fetchApplyFriend({
          applyUserId: tokenInfo.userId,
          permitUserId: Number(userId),
        }),
        data => {
          setError(false)
          setHelperText("")
          setOpenApplyAlert(true)
          onClose()
        },
      )
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          onClose()
        }}
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
          好友申請
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
          <Box display="flex" gap={1}>
            <TextField
              inputRef={inputRef}
              autoFocus
              label="User ID"
              type="text"
              error={error}
              helperText={helperText}
              fullWidth
              variant="outlined"
            />
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ height: "56px" }}
            >
              送出
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openApplyAlert}
        autoHideDuration={3000}
        onClose={() => setOpenApplyAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenApplyAlert(false)}
          severity={"success"}
          variant="filled"
        >
          {"好友申請成功！"}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AddFriendDiaLog
