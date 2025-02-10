import type React from "react"
import { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import { fetchRegisterUser } from "../../../services/UserAPI"
import { ErrorDialog } from "../../../components/ErrorDialog"
import { useAppDispatch } from "../../../app/hooks"
import { setUser } from "../../common/globalSlice"

// 使用 React.FC 來定義函數式組件
interface RegisterDialogProps {
  open: boolean
  onClose: () => void
}

export const RegisterDiaLog: React.FC<RegisterDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  let request = {
    name: name,
    email: email,
    password: password,
  }

  const [errorMessage, setErrorMessage] = useState("")
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const handleRegister = async () => {
    const apiResponse = await fetchRegisterUser(request)
    if (
      apiResponse.code !== 0
    ) {
      setErrorMessage(apiResponse.errorMessage || "註冊失敗，請稍後再試。")
      setErrorDialogOpen(true)
      return
    }

    if (!apiResponse.data || typeof apiResponse.data.userId === "undefined") {
      throw new Error("User ID is required but missing.");
    }

    const data = apiResponse.data
    dispatch(
      setUser({
        id: data.userId,
        name: name,
        email: email,
      }),
    )
    setErrorDialogOpen(false)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Sign up</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            margin="normal"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRegister()}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorDialog
        open={errorDialogOpen}
        errorMessage={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
      />
    </>
  )
}
