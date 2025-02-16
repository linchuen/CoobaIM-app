import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import type React from "react"
import { useRef } from "react"

interface AddFriendDiaLogProps {
  open: boolean
  onClose: () => void
}

const AddFriendDiaLog: React.FC<AddFriendDiaLogProps> = ({ open, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    onClose()
  }

  const handleSearch = async () => {
    if (inputRef.current) {
      const searchId = inputRef.current.value
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* 標題區 (含關閉按鈕) */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">搜尋用戶</Typography>
        <IconButton onClick={handleClose} size="small">
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
            fullWidth
            variant="outlined"
          />
          <Button onClick={handleSearch} variant="contained">
            搜尋
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddFriendDiaLog
