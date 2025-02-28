import type React from "react"
import { useRef } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import { fetchRegisterUser } from "../../../services/UserAPI"
import { useAppDispatch } from "../../../app/hooks"
import { handleFetch } from "../../../services/common"
import type {
  RegisterResponse,
} from "../../../services/ResponseInterface"

interface RegisterDialogProps {
  open: boolean
  onClose: () => void
}

export const RegisterDiaLog: React.FC<RegisterDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch()
  const email = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const name = useRef<HTMLInputElement>(null)
  const phone = useRef<HTMLInputElement>(null)

  const handleRegister = () => {
    if (!name.current || !email.current || !password.current) return
    handleFetch<RegisterResponse>(
      dispatch,
      fetchRegisterUser({
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
      }),
      data => {
        onClose()
      },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Sign up</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          value={name}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
        />
        <TextField
          fullWidth
          label="Phone"
          variant="outlined"
          margin="normal"
          value={phone}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
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
  )
}
