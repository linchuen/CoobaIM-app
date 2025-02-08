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
import { fetchRegister } from "../../../fetch/LoginAPI"

// 使用 React.FC 來定義函數式組件
interface RegisterDialogProps {
  open: boolean
  onClose: () => void
}

const RegisterDiaLog: React.FC<RegisterDialogProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  let data = {
    name: name,
    email: email,
    password: password,
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
          onClick={() => fetchRegister(data)}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RegisterDiaLog
